using Microsoft.EntityFrameworkCore;
using SGIP.Domain.Entities;
using SGIP.Domain.Enums;

namespace SGIP.Infrastructure.Data;

public static class DbSeeder
{
    public static async Task SeedAsync(
        ApplicationDbContext context)
    {
        if (!await context.Users.AnyAsync())
        {
            var users = new List<User>
            {
                new()
                {
                    Id = Guid.NewGuid(),
                    UserId = "user-123",
                    Name = "Juan Perez",
                    Email = "juan@example.com",
                    MonthlyIncome = 5000m,
                    CreatedAt = DateTime.UtcNow
                },

                new()
                {
                    Id = Guid.NewGuid(),
                    UserId = "user-456",
                    Name = "Maria Lopez",
                    Email = "maria@example.com",
                    MonthlyIncome = 8000m,
                    CreatedAt = DateTime.UtcNow
                }
            };

            await context.Users.AddRangeAsync(users);
        }

        if (!await context.Loans.AnyAsync())
        {
            var loan = new Loan
            {
                Id = Guid.NewGuid(),
                UserId = "user-123",
                Amount = 5000m,
                Term = 12,
                InterestRate = 0.24m,
                LoanType = LoanType.Fixed,
                Status = LoanStatus.Pending,
                MonthlyPayment = 467.26m,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            await context.Loans.AddAsync(loan);
        }

        await context.SaveChangesAsync();
    }
}