using Microsoft.EntityFrameworkCore;
using SGIP.Application.DTOs.Transactions;
using SGIP.Application.Repositories.Interfaces;
using SGIP.Application.Services;
using SGIP.Domain.Enums;
using SGIP.Infrastructure.Data;
using SGIP.Infrastructure.Repositories.Implementations;

namespace SGIP.Tests.Integration;

public class TransactionServiceTests
{
    [Fact]
    public async Task CreateAsync_ShouldReturnOriginalTransaction_WhenIdempotencyKeyAlreadyExists()
    {
        // Arrange
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(
                databaseName: Guid.NewGuid().ToString()
            )
            .Options;

        await using var context =
            new ApplicationDbContext(options);

        var repository =
            new TransactionRepository(context);

        var service =
            new TransactionService(repository);

        var request = new CreateTransactionRequest
        {
            IdempotencyKey = "PAYMENT-TEST-IDEMPOTENCY",
            Type = TransactionType.Payment,
            Amount = 500m,
            Description = "Pago de prueba"
        };

        // Act
        var firstResult =
            await service.CreateAsync(request);

        var secondResult =
            await service.CreateAsync(request);

        // Assert
        Assert.Equal(
            firstResult.Id,
            secondResult.Id
        );

        Assert.Equal(
            firstResult.IdempotencyKey,
            secondResult.IdempotencyKey
        );

        Assert.Equal(
            firstResult.CreatedAt,
            secondResult.CreatedAt
        );

        var transactionCount =
            await context.Transactions.CountAsync();

        Assert.Equal(
            1,
            transactionCount
        );
    }
}