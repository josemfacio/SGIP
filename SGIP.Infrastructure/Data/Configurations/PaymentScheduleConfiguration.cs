using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SGIP.Domain.Entities;

namespace SGIP.Infrastructure.Data.Configurations;

public class PaymentScheduleConfiguration
    : IEntityTypeConfiguration<PaymentSchedule>
{
    public void Configure(
        EntityTypeBuilder<PaymentSchedule> builder)
    {
        builder.HasKey(x => x.Id);

        builder.Property(x => x.TotalPayment)
            .HasPrecision(18, 2);

        builder.Property(x => x.Principal)
            .HasPrecision(18, 2);

        builder.Property(x => x.Interest)
            .HasPrecision(18, 2);

        builder.Property(x => x.RemainingBalance)
            .HasPrecision(18, 2);
    }
}