using System;

public class WordDocument : IDocument
{
    public void Open()
    {
        Console.WriteLine("Opening Word document...");
    }

    public void Save()
    {
        Console.WriteLine("Saving Word document...");
    }

    public void Close()
    {
        Console.WriteLine("Closing Word document...");
    }
}