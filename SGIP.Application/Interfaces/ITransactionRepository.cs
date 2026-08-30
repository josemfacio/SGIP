using SGIP.Domain.Entities;
using SGIP.Domain.Enums;

namespace SGIP.Application.Repositories.Interfaces;

public interface ITransactionRepository
{
    Task<Transaction?> GetByIdAsync(Guid id);

    Task<Transaction?> GetByIdempotencyKeyAsync(string idempotencyKey);


    Task<IEnumerable<Transaction>> GetAllAsync(
    TransactionType? type = null,
    TransactionStatus? status = null,
    DateTime? from = null,
    DateTime? to = null
);

    Task AddAsync(Transaction transaction);

    Task SaveChangesAsync();
}