using Microsoft.EntityFrameworkCore;
using SGIP.Domain.Entities;
using System.Collections.Generic;
using System.Reflection.Emit;

namespace SGIP.Infrastructure.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(
        DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<Loan> Loans => Set<Loan>();
    public DbSet<PaymentSchedule> PaymentSchedules => Set<PaymentSchedule>();
    public DbSet<Transaction> Transactions => Set<Transaction>();

    public DbSet<User> Users => Set<User>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.ApplyConfigurationsFromAssembly(
            typeof(ApplicationDbContext).Assembly
        );
    }
}