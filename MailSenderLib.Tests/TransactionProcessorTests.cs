using System;
using Moq;
using NUnit.Framework;
using MailSenderLib;

namespace MailSenderLib.Tests;

[TestFixture]
public class TransactionProcessorTests
{
    private Mock<IMailService> _mockMailService;
    private TransactionProcessor _processor;

    [SetUp]
    public void SetUp()
    {
        _mockMailService = new Mock<IMailService>();
        _processor = new TransactionProcessor(_mockMailService.Object);
    }

    [Test]
    public void Process_ValidTransaction_SendsMailAndReturnsTrue()
    {
        // Arrange
        var transaction = new Transaction
        {
            TransactionId = "TXN123",
            Amount = 150.00m,
            UserEmail = "user@example.com"
        };

        // Setup mock to return true when SendEmail is called with matching parameters
        _mockMailService
            .Setup(m => m.SendEmail(
                It.Is<string>(to => to == "user@example.com"),
                It.Is<string>(subject => subject.Contains("TXN123")),
                It.Is<string>(body => body.Contains("150") && body.Contains("processed successfully"))))
            .Returns(true);

        // Act
        bool result = _processor.Process(transaction);

        // Assert
        Assert.Multiple(() =>
        {
            Assert.That(result, Is.True);
            Assert.That(transaction.Status, Is.EqualTo("Completed"));
        });

        // Verify that SendEmail was indeed called once with the expected parameters
        _mockMailService.Verify(m => m.SendEmail(
            "user@example.com",
            It.Is<string>(s => s.Contains("TXN123")),
            It.Is<string>(b => b.Contains("150"))), 
            Times.Once);
    }

    [Test]
    public void Process_MailServiceFails_ReturnsFalse()
    {
        // Arrange
        var transaction = new Transaction
        {
            TransactionId = "TXN456",
            Amount = 50.00m,
            UserEmail = "user2@example.com"
        };

        // Setup mock to return false when SendEmail is called
        _mockMailService
            .Setup(m => m.SendEmail(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>()))
            .Returns(false);

        // Act
        bool result = _processor.Process(transaction);

        // Assert
        Assert.That(result, Is.False);
        _mockMailService.Verify(m => m.SendEmail(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>()), Times.Once);
    }

    [Test]
    public void Process_EmptyUserEmail_DoesNotSendMailAndReturnsFalse()
    {
        // Arrange
        var transaction = new Transaction
        {
            TransactionId = "TXN789",
            Amount = 20.00m,
            UserEmail = "" // Invalid/Empty Email
        };

        // Act
        bool result = _processor.Process(transaction);

        // Assert
        Assert.That(result, Is.False);
        
        // Verify that SendEmail was NEVER called because of invalid email check
        _mockMailService.Verify(m => m.SendEmail(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>()), Times.Never);
    }
}
