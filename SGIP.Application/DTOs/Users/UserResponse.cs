namespace SGIP.Application.DTOs.Users;

public class UserResponse
{
    public string UserId { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public decimal MonthlyIncome { get; set; }
    public DateTime CreatedAt { get; set; }
}
