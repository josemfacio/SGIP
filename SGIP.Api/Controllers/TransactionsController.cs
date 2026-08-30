using Microsoft.AspNetCore.Mvc;
using SGIP.Application.DTOs.Transactions;
using SGIP.Application.Services.Interfaces;
using SGIP.Domain.Enums;

namespace SGIP.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TransactionsController : ControllerBase
{
    private readonly ITransactionService _transactionService;

    public TransactionsController(
        ITransactionService transactionService)
    {
        _transactionService = transactionService;
    }

    [HttpPost]
    public async Task<ActionResult<TransactionResponse>> Create(
        [FromBody] CreateTransactionRequest request)
    {
        try
        {
            var result =
                await _transactionService.CreateAsync(request);

            return Ok(result);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new
            {
                message = ex.Message
            });
        }
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<TransactionResponse>>> GetAll(
     [FromQuery] TransactionType? type = null,
     [FromQuery] TransactionStatus? status = null,
     [FromQuery] DateTime? from = null,
     [FromQuery] DateTime? to = null)
    {
        var result = await _transactionService.GetAllAsync(
            type,
            status,
            from,
            to
        );

        return Ok(result);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<TransactionResponse>> GetById(
        Guid id)
    {
        var result =
            await _transactionService.GetByIdAsync(id);

        if (result is null)
        {
            return NotFound(new
            {
                message = "Transacción no encontrada."
            });
        }

        return Ok(result);
    }
}