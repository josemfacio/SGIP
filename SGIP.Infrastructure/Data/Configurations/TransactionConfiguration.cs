using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SGIP.Domain.Entities;

namespace SGIP.Infrastructure.Data.Configurations;

public class TransactionConfiguration
    : IEntityTypeConfiguration<Transaction>
{
    public void Configure(
        EntityTypeBuilder<Transaction> builder)
    {
        builder.HasKey(x => x.Id);

        builder.Property(x => x.IdempotencyKey)
            .IsRequired()
            .HasMaxLength(150);

        builder.HasIndex(x => x.IdempotencyKey)
            .IsUnique();

        builder.Property(x => x.Amount)
            .HasPrecision(18, 2);

        builder.Property(x => x.Description)
            .HasMaxLength(500);
    }
}