using SGIP.Domain.Entities;

namespace SGIP.Application.Repositories.Interfaces;

public interface IUserRepository
{
    Task<User?> GetByUserIdAsync(string userId);
    Task<User?> GetByEmailAsync(string email);
    Task<IEnumerable<User>> GetAllAsync();
    Task AddAsync(User user);
    Task SaveChangesAsync();
}
