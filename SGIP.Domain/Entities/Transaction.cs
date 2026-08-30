using SGIP.Domain.Enums;

namespace SGIP.Domain.Entities;

public class Transaction
{
    public Guid Id { get; set; }

    public string IdempotencyKey { get; set; } = string.Empty;

    public TransactionType Type { get; set; }

    public decimal Amount { get; set; }

    public TransactionStatus Status { get; set; }

    public Guid? LoanId { get; set; }

    public string? Description { get; set; }

    public DateTime CreatedAt { get; set; }

    public Loan? Loan { get; set; }
}