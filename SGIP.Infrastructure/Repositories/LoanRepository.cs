using Microsoft.EntityFrameworkCore;
using SGIP.Application.Repositories.Interfaces;
using SGIP.Domain.Entities;
using SGIP.Domain.Enums;
using SGIP.Infrastructure.Data;

namespace SGIP.Infrastructure.Repositories.Implementations;

public class LoanRepository : ILoanRepository
{
    private readonly ApplicationDbContext _context;

    public LoanRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Loan?> GetByIdAsync(Guid id)
    {
        return await _context.Loans
            .Include(x => x.PaymentSchedules)
            .Include(x => x.Transactions)
            .FirstOrDefaultAsync(x => x.Id == id);
    }

    public async Task<IEnumerable<Loan>> GetAllAsync(string? userId = null)
    {
        var query = _context.Loans
            .AsNoTracking()
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(userId))
        {
            query = query.Where(x => x.UserId == userId);
        }

        return await query
            .OrderByDescending(x => x.CreatedAt)
            .ToListAsync();
    }

    public async Task AddAsync(Loan loan)
    {
        await _context.Loans.AddAsync(loan);
    }

    public async Task SaveChangesAsync()
    {
        await _context.SaveChangesAsync();
    }

    public async Task<int> GetActiveLoanCountAsync(string userId)
    {
        return await _context.Loans.CountAsync(x =>
            x.UserId == userId &&
            (x.Status == LoanStatus.Approved ||
             x.Status == LoanStatus.Active)
        );
    }
    public async Task<decimal> GetActiveMonthlyPaymentSumAsync(
    string userId)
    {
        return await _context.Loans
            .Where(x =>
                x.UserId == userId &&
                (x.Status == LoanStatus.Approved ||
                 x.Status == LoanStatus.Active)
            )
            .SumAsync(x => x.MonthlyPayment);
    }
}