using SGIP.Domain.Entities;

namespace SGIP.Application.Repositories.Interfaces;

public interface ILoanRepository
{
    Task<Loan?> GetByIdAsync(Guid id);

    Task<IEnumerable<Loan>> GetAllAsync(string? userId = null);

    Task AddAsync(Loan loan);

    Task SaveChangesAsync();

    Task<int> GetActiveLoanCountAsync(string userId);

    Task<decimal> GetActiveMonthlyPaymentSumAsync(string userId);
}