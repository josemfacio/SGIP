using SGIP.Application.DTOs.Loans;

namespace SGIP.Application.Services.Interfaces;

public interface ILoanService
{
    LoanSimulationResponse Simulate(
        SimulateLoanRequest request
    );

    Task<LoanResponse> CreateAsync(
        CreateLoanRequest request
    );

    Task<LoanResponse?> GetByIdAsync(Guid id);
    Task<IEnumerable<LoanResponse>> GetAllAsync(
        string? userId = null
    );

    Task<IEnumerable<PaymentScheduleResponse>?> GetScheduleAsync(
        Guid loanId
    );
    Task<LoanResponse?> ApproveAsync(Guid id);
    Task<LoanResponse?> RejectAsync(Guid id);
}