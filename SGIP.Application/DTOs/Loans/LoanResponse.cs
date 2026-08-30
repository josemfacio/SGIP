using SGIP.Domain.Enums;

namespace SGIP.Application.DTOs.Loans;

public class LoanResponse
{
    public Guid Id { get; set; }

    public string UserId { get; set; } = string.Empty;

    public decimal Amount { get; set; }

    public int Term { get; set; }

    public decimal InterestRate { get; set; }

    public LoanType LoanType { get; set; }

    public LoanStatus Status { get; set; }

    public decimal MonthlyPayment { get; set; }

    public DateTime CreatedAt { get; set; }
}