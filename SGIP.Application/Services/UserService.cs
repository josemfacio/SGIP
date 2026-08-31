using System.Net.Mail;
using SGIP.Application.DTOs.Users;
using SGIP.Application.Repositories.Interfaces;
using SGIP.Application.Services.Interfaces;
using SGIP.Domain.Entities;

namespace SGIP.Application.Services;

public class UserService : IUserService
{
    private readonly IUserRepository _userRepository;

    public UserService(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    public async Task<IEnumerable<UserResponse>> GetAllAsync()
    {
        var users = await _userRepository.GetAllAsync();
        return users.Select(Map);
    }

    public async Task<UserResponse> CreateAsync(CreateUserRequest request)
    {
        var name = request.Name.Trim();
        var email = request.Email.Trim().ToLowerInvariant();

        if (name.Length is < 2 or > 100)
            throw new ArgumentException("El nombre debe tener entre 2 y 100 caracteres.");

        if (!MailAddress.TryCreate(email, out _))
            throw new ArgumentException("El correo electrónico no es válido.");

        if (request.MonthlyIncome <= 0)
            throw new ArgumentException("El ingreso mensual debe ser mayor a cero.");

        if (await _userRepository.GetByEmailAsync(email) is not null)
            throw new InvalidOperationException("Ya existe un usuario con ese correo electrónico.");

        var user = new User
        {
            Id = Guid.NewGuid(),
            UserId = $"user-{Guid.NewGuid():N}"[..13],
            Name = name,
            Email = email,
            MonthlyIncome = request.MonthlyIncome,
            CreatedAt = DateTime.UtcNow
        };

        await _userRepository.AddAsync(user);
        await _userRepository.SaveChangesAsync();
        return Map(user);
    }

    private static UserResponse Map(User user) => new()
    {
        UserId = user.UserId,
        Name = user.Name,
        Email = user.Email,
        MonthlyIncome = user.MonthlyIncome,
        CreatedAt = user.CreatedAt
    };
}
