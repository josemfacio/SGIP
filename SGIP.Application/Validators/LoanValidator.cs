namespace SGIP.Application.Validators;

public class LoanValidator
{
    public bool IsValidAmount(decimal amount)
    {
        return amount >= 500m && amount <= 50000m;
    }

    public bool IsValidTerm(int term)
    {
        return term >= 6 && term <= 60;
    }
}