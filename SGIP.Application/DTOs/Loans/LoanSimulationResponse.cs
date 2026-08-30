namespace SGIP.Application.DTOs.Loans;

public class LoanSimulationResponse
{
    public decimal Amount { get; set; }

    public int Term { get; set; }

    public decimal AnnualEffectiveRate { get; set; }

    public decimal MonthlyEffectiveRate { get; set; }

    public decimal MonthlyPayment { get; set; }

    public List<PaymentScheduleResponse> Schedule { get; set; } = [];
}