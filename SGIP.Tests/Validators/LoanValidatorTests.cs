using SGIP.Application.Validators;

namespace SGIP.Tests.Validators;

public class LoanValidatorTests
{
    private readonly LoanValidator _validator;

    public LoanValidatorTests()
    {
        _validator = new LoanValidator();
    }

    [Theory]
    [InlineData(500)]
    [InlineData(10000)]
    [InlineData(50000)]
    public void IsValidAmount_ShouldReturnTrue_WhenAmountIsWithinRange(decimal amount)
    {
        var result = _validator.IsValidAmount(amount);

        Assert.True(result);
    }

    [Theory]
    [InlineData(499)]
    [InlineData(50001)]
    public void IsValidAmount_ShouldReturnFalse_WhenAmountIsOutsideRange(decimal amount)
    {
        var result = _validator.IsValidAmount(amount);

        Assert.False(result);
    }

    [Theory]
    [InlineData(6)]
    [InlineData(12)]
    [InlineData(36)]
    [InlineData(60)]
    public void IsValidTerm_ShouldReturnTrue_WhenTermIsWithinRange(int term)
    {
        var result = _validator.IsValidTerm(term);

        Assert.True(result);
    }

    [Theory]
    [InlineData(5)]
    [InlineData(61)]
    public void IsValidTerm_ShouldReturnFalse_WhenTermIsOutsideRange(int term)
    {
        var result = _validator.IsValidTerm(term);

        Assert.False(result);
    }
}