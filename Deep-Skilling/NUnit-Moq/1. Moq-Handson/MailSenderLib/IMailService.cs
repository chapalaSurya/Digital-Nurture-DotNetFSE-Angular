namespace MailSenderLib;

public interface IMailService
{
    bool SendEmail(string to, string subject, string body);
}
