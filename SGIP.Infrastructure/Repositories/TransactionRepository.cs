using Microsoft.EntityFrameworkCore;
using SGIP.Application.Repositories.Interfaces;
using SGIP.Domain.Entities;
using SGIP.Domain.Enums;
using SGIP.Infrastructure.Data;

namespace SGIP.Infrastructure.Repositories.Implementations;

public class TransactionRepository : ITransactionRepository
{
    private readonly ApplicationDbContext _context;

    public TransactionRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Transaction?> GetByIdAsync(Guid id)
    {
        return await _context.Transactions
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.Id == id);
    }

    public async Task<Transaction?> GetByIdempotencyKeyAsync(
        string idempotencyKey)
    {
        return await _context.Transactions
            .AsNoTracking()
            .FirstOrDefaultAsync(x =>
                x.IdempotencyKey == idempotencyKey);
    }

    public async Task<IEnumerable<Transaction>> GetAllAsync(
     TransactionType? type = null,
     TransactionStatus? status = null,
     DateTime? from = null,
     DateTime? to = null)
    {
        var query = _context.Transactions
            .AsNoTracking()
            .AsQueryable();

        if (type.HasValue)
            query = query.Where(x => x.Type == type.Value);

        if (status.HasValue)
            query = query.Where(x => x.Status == status.Value);

        if (from.HasValue)
            query = query.Where(x => x.CreatedAt >= from.Value);

        if (to.HasValue)
            query = query.Where(x => x.CreatedAt <= to.Value);

        return await query
            .OrderByDescending(x => x.CreatedAt)
            .ToListAsync();
    }
    public async Task AddAsync(Transaction transaction)
    {
        await _context.Transactions.AddAsync(transaction);
    }

    public async Task SaveChangesAsync()
    {
        await _context.SaveChangesAsync();
    }
}