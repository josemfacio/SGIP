using Microsoft.EntityFrameworkCore;
using SGIP.Application.DTOs.Users;
using SGIP.Application.Services;
using SGIP.Infrastructure.Data;
using SGIP.Infrastructure.Repositories.Implementations;

namespace SGIP.Tests.Integrations;

public class UserServiceTests
{
    [Fact]
    public async Task CreateAsync_CreatesAndReturnsNormalizedUser()
    {
        await using var context = CreateContext();
        var service = new UserService(new UserRepository(context));

        var result = await service.CreateAsync(new CreateUserRequest
        {
            Name = "  Ana Pérez  ",
            Email = "ANA@EXAMPLE.COM ",
            MonthlyIncome = 6500m
        });

        Assert.StartsWith("user-", result.UserId);
        Assert.Equal("Ana Pérez", result.Name);
        Assert.Equal("ana@example.com", result.Email);
        Assert.Single(await service.GetAllAsync());
    }

    [Fact]
    public async Task CreateAsync_RejectsDuplicateEmail()
    {
        await using var context = CreateContext();
        var service = new UserService(new UserRepository(context));
        var request = new CreateUserRequest
        {
            Name = "Ana Pérez",
            Email = "ana@example.com",
            MonthlyIncome = 6500m
        };

        await service.CreateAsync(request);

        var exception = await Assert.ThrowsAsync<InvalidOperationException>(() =>
            service.CreateAsync(request));
        Assert.Contains("Ya existe", exception.Message);
    }

    private static ApplicationDbContext CreateContext()
    {
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;
        return new ApplicationDbContext(options);
    }
}
