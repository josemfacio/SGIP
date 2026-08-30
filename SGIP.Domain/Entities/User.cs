namespace SGIP.Domain.Entities;

public class User
{
    public Guid Id { get; set; }

    public string UserId { get; set; } = string.Empty;

    public string Name { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public decimal MonthlyIncome { get; set; }

    public DateTime CreatedAt { get; set; }
}