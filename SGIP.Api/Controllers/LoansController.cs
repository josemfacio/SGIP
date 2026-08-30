using Microsoft.AspNetCore.Mvc;
using SGIP.Application.DTOs.Loans;
using SGIP.Application.Services.Interfaces;

namespace SGIP.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class LoansController : ControllerBase
{
    private readonly ILoanService _loanService;

    public LoansController(ILoanService loanService)
    {
        _loanService = loanService;
    }

    [HttpPost("simulate")]
    public ActionResult<LoanSimulationResponse> Simulate(
        [FromBody] SimulateLoanRequest request)
    {
        try
        {
            var result = _loanService.Simulate(request);

            return Ok(result);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new
            {
                message = ex.Message
            });
        }
        catch (NotSupportedException ex)
        {
            return BadRequest(new
            {
                message = ex.Message
            });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new
            {
                message = ex.Message
            });
        }
    }

    [HttpPost]
    public async Task<ActionResult<LoanResponse>> Create(
    [FromBody] CreateLoanRequest request)
    {
        try
        {
            var result = await _loanService.CreateAsync(request);

            return CreatedAtAction(
                nameof(GetById),
                new { id = result.Id },
                result
            );
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new
            {
                message = ex.Message
            });
        }
        catch (NotSupportedException ex)
        {
            return BadRequest(new
            {
                message = ex.Message
            });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new
            {
                message = ex.Message
            });
        }
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<LoanResponse>> GetById(Guid id)
    {
        var result = await _loanService.GetByIdAsync(id);

        if (result is null)
        {
            return NotFound(new
            {
                message = "Préstamo no encontrado."
            });
        }

        return Ok(result);
    }
    [HttpGet]
    public async Task<ActionResult<IEnumerable<LoanResponse>>> GetAll(
    [FromQuery] string? userId = null)
    {
        var result = await _loanService.GetAllAsync(userId);

        return Ok(result);
    }
    [HttpGet("{id:guid}/schedule")]
    public async Task<ActionResult<IEnumerable<PaymentScheduleResponse>>> GetSchedule(
    Guid id)
    {
        var result = await _loanService.GetScheduleAsync(id);

        if (result is null)
        {
            return NotFound(new
            {
                message = "Préstamo no encontrado."
            });
        }

        return Ok(result);
    }

    [HttpPatch("{id:guid}/approve")]
    public async Task<ActionResult<LoanResponse>> Approve(Guid id)
    {
        try
        {
            var result = await _loanService.ApproveAsync(id);

            if (result is null)
            {
                return NotFound(new
                {
                    message = "Préstamo no encontrado."
                });
            }

            return Ok(result);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new
            {
                message = ex.Message
            });
        }
    }
    [HttpPatch("{id:guid}/reject")]
    public async Task<ActionResult<LoanResponse>> Reject(Guid id)
    {
        try
        {
            var result = await _loanService.RejectAsync(id);

            if (result is null)
            {
                return NotFound(new
                {
                    message = "Préstamo no encontrado."
                });
            }

            return Ok(result);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new
            {
                message = ex.Message
            });
        }
    }
}
