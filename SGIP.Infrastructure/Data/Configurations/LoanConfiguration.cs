using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SGIP.Domain.Entities;

namespace SGIP.Infrastructure.Data.Configurations;

public class LoanConfiguration : IEntityTypeConfiguration<Loan>
{
    public void Configure(EntityTypeBuilder<Loan> builder)
    {
        builder.HasKey(x => x.Id);

        builder.Property(x => x.UserId)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(x => x.Amount)
            .HasPrecision(18, 2);

        builder.Property(x => x.InterestRate)
            .HasPrecision(10, 6);

        builder.Property(x => x.MonthlyPayment)
            .HasPrecision(18, 2);

        builder.HasMany(x => x.PaymentSchedules)
            .WithOne(x => x.Loan)
            .HasForeignKey(x => x.LoanId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(x => x.Transactions)
            .WithOne(x => x.Loan)
            .HasForeignKey(x => x.LoanId)
            .OnDelete(DeleteBehavior.SetNull);
    }
}