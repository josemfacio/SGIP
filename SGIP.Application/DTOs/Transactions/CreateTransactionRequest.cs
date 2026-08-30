using SGIP.Domain.Enums;

namespace SGIP.Application.DTOs.Transactions;

public class CreateTransactionRequest
{
    public string IdempotencyKey { get; set; } = string.Empty;

    public TransactionType Type { get; set; }

    public decimal Amount { get; set; }

    public Guid? LoanId { get; set; }

    public string? Description { get; set; }
}