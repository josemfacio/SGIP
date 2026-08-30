using SGIP.Application.DTOs.Transactions;
using SGIP.Domain.Enums;

namespace SGIP.Application.Services.Interfaces;

public interface ITransactionService
{
    Task<TransactionResponse> CreateAsync(
        CreateTransactionRequest request
    );

    Task<IEnumerable<TransactionResponse>> GetAllAsync(
     TransactionType? type = null,
     TransactionStatus? status = null,
     DateTime? from = null,
     DateTime? to = null
 );

    Task<TransactionResponse?> GetByIdAsync(Guid id);
}