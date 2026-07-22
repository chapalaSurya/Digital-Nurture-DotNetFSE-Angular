namespace MailSenderLib;

public class Transaction
{
    public string TransactionId { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public string UserEmail { get; set; } = string.Empty;
    public string Status { get; set; } = "Pending";
}
