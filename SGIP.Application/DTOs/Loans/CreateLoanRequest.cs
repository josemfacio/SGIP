using SGIP.Domain.Enums;

namespace SGIP.Application.DTOs.Loans;

public class CreateLoanRequest
{
    public string UserId { get; set; } = "user-123";

    public decimal Amount { get; set; }

    public int Term { get; set; }

    public LoanType LoanType { get; set; } = LoanType.Fixed;
}