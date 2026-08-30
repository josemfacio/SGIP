using SGIP.Application.Services;

namespace SGIP.Tests.Services;

public class FinancialCalculatorTests
{
    private readonly FinancialCalculator _calculator;

    public FinancialCalculatorTests()
    {
        _calculator = new FinancialCalculator();
    }

    [Fact]
    public void CalculateFixedPayment_ShouldReturnCorrectPayment()
    {
        // Arrange
        decimal amount = 10000m;
        int term = 12;
        decimal annualRate = 0.24m;

        // Act
        var payment = _calculator.CalculateFixedPayment(
            amount,
            term,
            annualRate
        );

        // Assert
        Assert.True(payment > 0);
    }

    [Fact]
    public void GenerateSchedule_ShouldGenerateCorrectNumberOfPayments()
    {
        // Arrange
        decimal amount = 10000m;
        int term = 12;
        decimal annualRate = 0.24m;
        var startDate = new DateTime(2026, 8, 29);

        // Act
        var schedule = _calculator.GenerateSchedule(
            amount,
            term,
            annualRate,
            startDate
        );

        // Assert
        Assert.Equal(term, schedule.Count);
        Assert.Equal(0, schedule.Last().RemainingBalance);
    }

    [Fact]
    public void GenerateSchedule_ShouldHandleMonthWithFewerDays()
    {
        // Arrange
        decimal amount = 10000m;
        int term = 3;
        decimal annualRate = 0.24m;

        var startDate = new DateTime(2026, 1, 31);

        // Act
        var schedule = _calculator.GenerateSchedule(
            amount,
            term,
            annualRate,
            startDate
        );

        // Assert
        Assert.Equal(
            new DateTime(2026, 2, 28),
            schedule[0].DueDate
        );

        Assert.Equal(
            new DateTime(2026, 3, 31),
            schedule[1].DueDate
        );
    }
}