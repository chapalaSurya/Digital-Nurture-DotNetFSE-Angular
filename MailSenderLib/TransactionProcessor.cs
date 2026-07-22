using System;

namespace MailSenderLib;

public class TransactionProcessor
{
    private readonly IMailService _mailService;

    public TransactionProcessor(IMailService mailService)
    {
        _mailService = mailService ?? throw new ArgumentNullException(nameof(mailService));
    }

    public bool Process(Transaction transaction)
    {
        if (transaction == null)
            throw new ArgumentNullException(nameof(transaction));

        if (string.IsNullOrEmpty(transaction.UserEmail))
            return false;

        // Perform transaction processing logic
        transaction.Status = "Completed";

        // Notify user via mail service
        string subject = $"Transaction {transaction.TransactionId} Completed";
        string body = $"Dear User, your transaction of amount {transaction.Amount:C} has been processed successfully.";
        
        bool mailSent = _mailService.SendEmail(transaction.UserEmail, subject, body);
        return mailSent;
    }
}
