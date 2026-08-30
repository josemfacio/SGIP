using SGIP.Domain.Entities;

namespace SGIP.Application.Repositories.Interfaces;

public interface IUserRepository
{
    Task<User?> GetByUserIdAsync(string userId);
}