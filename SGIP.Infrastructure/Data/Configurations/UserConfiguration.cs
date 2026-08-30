using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SGIP.Domain.Entities;

namespace SGIP.Infrastructure.Data.Configurations;

public class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.HasKey(x => x.Id);

        builder.Property(x => x.Name)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(x => x.Email)
            .IsRequired()
            .HasMaxLength(150);

        builder.HasIndex(x => x.Email)
            .IsUnique();

        builder.Property(x => x.MonthlyIncome)
            .HasPrecision(18, 2);

        builder.Property(x => x.UserId)
            .IsRequired()
            .HasMaxLength(100);

        builder.HasIndex(x => x.UserId)
            .IsUnique();
    }
}