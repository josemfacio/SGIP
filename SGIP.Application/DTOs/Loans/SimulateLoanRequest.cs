using SGIP.Domain.Enums;

namespace SGIP.Application.DTOs.Loans;

public class SimulateLoanRequest
{
    public decimal Amount { get; set; }

    public int Term { get; set; }

    public LoanType LoanType { get; set; } = LoanType.Fixed;
}