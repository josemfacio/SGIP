using Microsoft.EntityFrameworkCore;
using SGIP.Application.DTOs.Loans;
using SGIP.Application.Services;
using SGIP.Application.Validators;
using SGIP.Domain.Entities;
using SGIP.Domain.Enums;
using SGIP.Infrastructure.Data;
using SGIP.Infrastructure.Repositories.Implementations;

namespace SGIP.Tests.Integration;

public class LoanServiceTests
{
    [Fact]
    public void Simulate_ShouldGenerateCompleteFixedPaymentSchedule()
    {
        using var fixture = CreateFixture();

        var result = fixture.Service.Simulate(new SimulateLoanRequest
        {
            Amount = 5_000m,
            Term = 12,
            LoanType = LoanType.Fixed
        });

        Assert.Equal(12, result.Schedule.Count);
        Assert.Equal(5_000m, result.Amount);
        Assert.True(result.MonthlyPayment > 0);
        Assert.Equal(0m, result.Schedule[^1].RemainingBalance);
    }

    [Theory]
    [InlineData(499, 12)]
    [InlineData(50_001, 12)]
    [InlineData(5_000, 5)]
    [InlineData(5_000, 61)]
    public void Simulate_ShouldRejectValuesOutsideAllowedRanges(
        decimal amount,
        int term)
    {
        using var fixture = CreateFixture();

        Assert.Throws<ArgumentException>(() =>
            fixture.Service.Simulate(new SimulateLoanRequest
            {
                Amount = amount,
                Term = term,
                LoanType = LoanType.Fixed
            }));
    }

    [Fact]
    public void Simulate_ShouldRejectUnsupportedLoanType()
    {
        using var fixture = CreateFixture();

        Assert.Throws<NotSupportedException>(() =>
            fixture.Service.Simulate(new SimulateLoanRequest
            {
                Amount = 5_000m,
                Term = 12,
                LoanType = LoanType.Decreasing
            }));
    }

    [Fact]
    public async Task CreateAsync_ShouldAutoApproveAndCreateDisbursement()
    {
        await using var fixture = CreateFixture();
        await AddUserAsync(fixture.Context, "client-auto", 10_000m);

        var result = await fixture.Service.CreateAsync(new CreateLoanRequest
        {
            UserId = "client-auto",
            Amount = 5_000m,
            Term = 12,
            LoanType = LoanType.Fixed
        });

        var savedLoan = await fixture.Context.Loans
            .Include(x => x.PaymentSchedules)
            .SingleAsync();
        var disbursement = await fixture.Context.Transactions.SingleAsync();

        Assert.Equal(LoanStatus.Approved, result.Status);
        Assert.Equal(12, savedLoan.PaymentSchedules.Count);
        Assert.Equal(TransactionType.Disbursement, disbursement.Type);
        Assert.Equal($"DISBURSEMENT-{result.Id}", disbursement.IdempotencyKey);
    }

    [Fact]
    public async Task CreateAsync_ShouldRemainPending_WhenAmountRequiresReview()
    {
        await using var fixture = CreateFixture();
        await AddUserAsync(fixture.Context, "client-review", 100_000m);

        var result = await fixture.Service.CreateAsync(new CreateLoanRequest
        {
            UserId = "client-review",
            Amount = 12_000m,
            Term = 12,
            LoanType = LoanType.Fixed
        });

        Assert.Equal(LoanStatus.Pending, result.Status);
        Assert.Empty(fixture.Context.Transactions);
    }

    [Fact]
    public async Task CreateAsync_ShouldRejectUnknownUser()
    {
        await using var fixture = CreateFixture();

        var exception = await Assert.ThrowsAsync<ArgumentException>(() =>
            fixture.Service.CreateAsync(ValidRequest("missing-user")));

        Assert.Equal("El usuario no existe.", exception.Message);
    }

    [Fact]
    public async Task CreateAsync_ShouldRejectFourthActiveLoan()
    {
        await using var fixture = CreateFixture();
        await AddUserAsync(fixture.Context, "client-limit", 100_000m);
        await AddActiveLoansAsync(fixture.Context, "client-limit", 3, 100m);

        var exception = await Assert.ThrowsAsync<InvalidOperationException>(() =>
            fixture.Service.CreateAsync(ValidRequest("client-limit")));

        Assert.Contains("más de 3 préstamos activos", exception.Message);
    }

    [Fact]
    public async Task CreateAsync_ShouldRejectWhenPaymentsExceedFortyPercentOfIncome()
    {
        await using var fixture = CreateFixture();
        await AddUserAsync(fixture.Context, "client-capacity", 1_000m);

        var exception = await Assert.ThrowsAsync<InvalidOperationException>(() =>
            fixture.Service.CreateAsync(ValidRequest("client-capacity")));

        Assert.Contains("supera el 40%", exception.Message);
    }

    [Fact]
    public async Task Queries_ShouldMapLoansAndReturnOrderedSchedule()
    {
        await using var fixture = CreateFixture();
        await AddUserAsync(fixture.Context, "client-query", 20_000m);
        var created = await fixture.Service.CreateAsync(ValidRequest("client-query"));

        var byId = await fixture.Service.GetByIdAsync(created.Id);
        var all = (await fixture.Service.GetAllAsync("client-query")).ToList();
        var schedule = (await fixture.Service.GetScheduleAsync(created.Id))!.ToList();

        Assert.Equal(created.Id, byId!.Id);
        Assert.Single(all);
        Assert.Equal(Enumerable.Range(1, 12), schedule.Select(x => x.PaymentNumber));
        Assert.Null(await fixture.Service.GetByIdAsync(Guid.NewGuid()));
        Assert.Null(await fixture.Service.GetScheduleAsync(Guid.NewGuid()));
    }

    [Fact]
    public async Task ApproveAsync_ShouldApprovePendingLoanAndDisburse()
    {
        await using var fixture = CreateFixture();
        var loan = await AddPendingLoanAsync(fixture.Context, "client-approve");

        var result = await fixture.Service.ApproveAsync(loan.Id);

        Assert.Equal(LoanStatus.Approved, result!.Status);
        Assert.Single(fixture.Context.Transactions);
        Assert.Null(await fixture.Service.ApproveAsync(Guid.NewGuid()));
        await Assert.ThrowsAsync<InvalidOperationException>(() =>
            fixture.Service.ApproveAsync(loan.Id));
    }

    [Fact]
    public async Task RejectAsync_ShouldRejectOnlyPendingLoan()
    {
        await using var fixture = CreateFixture();
        var loan = await AddPendingLoanAsync(fixture.Context, "client-reject");

        var result = await fixture.Service.RejectAsync(loan.Id);

        Assert.Equal(LoanStatus.Rejected, result!.Status);
        Assert.Null(await fixture.Service.RejectAsync(Guid.NewGuid()));
        await Assert.ThrowsAsync<InvalidOperationException>(() =>
            fixture.Service.RejectAsync(loan.Id));
    }

    private static LoanFixture CreateFixture()
    {
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;
        var context = new ApplicationDbContext(options);
        var loanRepository = new LoanRepository(context);
        var transactionRepository = new TransactionRepository(context);
        var service = new LoanService(
            new FinancialCalculator(),
            new LoanValidator(),
            loanRepository,
            transactionRepository,
            new UserRepository(context));

        return new LoanFixture(context, service);
    }

    private static CreateLoanRequest ValidRequest(string userId) => new()
    {
        UserId = userId,
        Amount = 5_000m,
        Term = 12,
        LoanType = LoanType.Fixed
    };

    private static async Task AddUserAsync(
        ApplicationDbContext context,
        string userId,
        decimal income)
    {
        context.Users.Add(new User
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            Name = userId,
            Email = $"{userId}@example.com",
            MonthlyIncome = income,
            CreatedAt = DateTime.UtcNow
        });
        await context.SaveChangesAsync();
    }

    private static async Task AddActiveLoansAsync(
        ApplicationDbContext context,
        string userId,
        int count,
        decimal monthlyPayment)
    {
        for (var index = 0; index < count; index++)
        {
            context.Loans.Add(new Loan
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                Amount = 1_000m,
                Term = 12,
                InterestRate = 0.24m,
                LoanType = LoanType.Fixed,
                Status = LoanStatus.Active,
                MonthlyPayment = monthlyPayment,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            });
        }

        await context.SaveChangesAsync();
    }

    private static async Task<Loan> AddPendingLoanAsync(
        ApplicationDbContext context,
        string userId)
    {
        var loan = new Loan
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            Amount = 12_000m,
            Term = 12,
            InterestRate = 0.24m,
            LoanType = LoanType.Fixed,
            Status = LoanStatus.Pending,
            MonthlyPayment = 1_000m,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
        context.Loans.Add(loan);
        await context.SaveChangesAsync();
        return loan;
    }

    private sealed class LoanFixture : IAsyncDisposable, IDisposable
    {
        public LoanFixture(ApplicationDbContext context, LoanService service)
        {
            Context = context;
            Service = service;
        }

        public ApplicationDbContext Context { get; }
        public LoanService Service { get; }

        public void Dispose() => Context.Dispose();

        public ValueTask DisposeAsync() => Context.DisposeAsync();
    }
}
