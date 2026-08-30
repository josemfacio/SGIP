using Microsoft.EntityFrameworkCore;
using SGIP.Application.Repositories.Interfaces;
using SGIP.Domain.Entities;
using SGIP.Infrastructure.Data;

namespace SGIP.Infrastructure.Repositories.Implementations;

public class UserRepository : IUserRepository
{
    private readonly ApplicationDbContext _context;

    public UserRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<User?> GetByUserIdAsync(string userId)
    {
        return await _context.Users
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.UserId == userId);
    }
}