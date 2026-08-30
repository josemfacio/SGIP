using SGIP.Application.DTOs.Transactions;
using SGIP.Application.Repositories.Interfaces;
using SGIP.Application.Services.Interfaces;
using SGIP.Domain.Entities;
using SGIP.Domain.Enums;

namespace SGIP.Application.Services;

public class TransactionService : ITransactionService
{
    private readonly ITransactionRepository _transactionRepository;

    public TransactionService(
        ITransactionRepository transactionRepository)
    {
        _transactionRepository = transactionRepository;
    }

    public async Task<TransactionResponse> CreateAsync(
        CreateTransactionRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.IdempotencyKey))
        {
            throw new ArgumentException(
                "El IdempotencyKey es obligatorio."
            );
        }

        if (request.Amount <= 0)
        {
            throw new ArgumentException(
                "El monto debe ser mayor a cero."
            );
        }

        var existingTransaction =
            await _transactionRepository
                .GetByIdempotencyKeyAsync(
                    request.IdempotencyKey
                );

        if (existingTransaction is not null)
        {
            return Map(existingTransaction);
        }

        var transaction = new Transaction
        {
            Id = Guid.NewGuid(),
            IdempotencyKey = request.IdempotencyKey,
            Type = request.Type,
            Amount = request.Amount,
            Status = TransactionStatus.Completed,
            LoanId = request.LoanId,
            Description = request.Description,
            CreatedAt = DateTime.UtcNow
        };

        await _transactionRepository.AddAsync(transaction);
        await _transactionRepository.SaveChangesAsync();

        return Map(transaction);
    }

    public async Task<IEnumerable<TransactionResponse>> GetAllAsync(
    TransactionType? type = null,
    TransactionStatus? status = null,
    DateTime? from = null,
    DateTime? to = null)
    {
        var transactions =
            await _transactionRepository.GetAllAsync(
                type,
                status,
                from,
                to
            );

        return transactions.Select(Map);
    }
    public async Task<TransactionResponse?> GetByIdAsync(Guid id)
    {
        var transaction =
            await _transactionRepository.GetByIdAsync(id);

        if (transaction is null)
        {
            return null;
        }

        return Map(transaction);
    }

    private static TransactionResponse Map(
        Transaction transaction)
    {
        return new TransactionResponse
        {
            Id = transaction.Id,
            IdempotencyKey = transaction.IdempotencyKey,
            Type = transaction.Type,
            Amount = transaction.Amount,
            Status = transaction.Status,
            LoanId = transaction.LoanId,
            Description = transaction.Description,
            CreatedAt = transaction.CreatedAt
        };
    }
}