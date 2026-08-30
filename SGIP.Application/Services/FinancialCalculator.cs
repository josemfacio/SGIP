using SGIP.Domain.Entities;
using SGIP.Domain.Enums;

namespace SGIP.Application.Services;

public class FinancialCalculator
{
    public decimal CalculateMonthlyEffectiveRate(decimal annualEffectiveRate)
    {
        var annualRate = (double)annualEffectiveRate;

        var monthlyRate = Math.Pow(
            1 + annualRate,
            1.0 / 12.0
        ) - 1;

        return (decimal)monthlyRate;
    }

    public decimal CalculateFixedPayment(
    decimal amount,
    int term,
    decimal annualEffectiveRate)
    {
        var monthlyRate =
            CalculateMonthlyEffectiveRate(annualEffectiveRate);

        var rate = (double)monthlyRate;

        var factor = Math.Pow(
            1 + rate,
            term
        );

        var payment =
            (double)amount *
            (rate * factor) /
            (factor - 1);

        return Math.Round(
            (decimal)payment,
            2,
            MidpointRounding.AwayFromZero
        );
    }

    public List<PaymentSchedule> GenerateSchedule(
    decimal amount,
    int term,
    decimal annualEffectiveRate,
    DateTime startDate)
    {
        var monthlyRate =
            CalculateMonthlyEffectiveRate(annualEffectiveRate);

        var monthlyPayment =
            CalculateFixedPayment(
                amount,
                term,
                annualEffectiveRate
            );

        var schedule = new List<PaymentSchedule>();

        var remainingBalance = amount;

        for (var paymentNumber = 1;
             paymentNumber <= term;
             paymentNumber++)
        {
            var interest =
                Math.Round(
                    remainingBalance * monthlyRate,
                    2,
                    MidpointRounding.AwayFromZero
                );

            var principal =
                monthlyPayment - interest;

            if (paymentNumber == term)
            {
                principal = remainingBalance;
                monthlyPayment = principal + interest;
            }

            remainingBalance -= principal;

            if (remainingBalance < 0)
            {
                remainingBalance = 0;
            }

            var payment = new PaymentSchedule
            {
                Id = Guid.NewGuid(),

                PaymentNumber = paymentNumber,

                DueDate = CalculateDueDate(
                    startDate,
                    paymentNumber
                ),

                TotalPayment =
                    Math.Round(monthlyPayment, 2),

                Principal =
                    Math.Round(principal, 2),

                Interest =
                    Math.Round(interest, 2),

                RemainingBalance =
                    Math.Round(remainingBalance, 2),

                Status =
                    PaymentScheduleStatus.Pending
            };

            schedule.Add(payment);
        }

        return schedule;
    }

    private DateTime CalculateDueDate(
    DateTime startDate,
    int monthsToAdd)
    {
        var targetDate =
            startDate.AddMonths(monthsToAdd);

        var originalDay =
            startDate.Day;

        var daysInTargetMonth =
            DateTime.DaysInMonth(
                targetDate.Year,
                targetDate.Month
            );

        var paymentDay =
            Math.Min(
                originalDay,
                daysInTargetMonth
            );

        return new DateTime(
    targetDate.Year,
    targetDate.Month,
    paymentDay,
    0,
    0,
    0,
    DateTimeKind.Utc
);
    }

}

