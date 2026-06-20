using System;

class Program
{
    static void Main()
    {
        Logger firstLogger = Logger.Instance;
        Logger secondLogger = Logger.Instance;

        Console.WriteLine(
            $"Are both loggers the same instance? " +
            $"{ReferenceEquals(firstLogger, secondLogger)}");

        firstLogger.Log(
            "This is a log message from the first reference.");

        secondLogger.Log(
            "This is a log message from the second reference.");

        Console.ReadLine();
    }
}