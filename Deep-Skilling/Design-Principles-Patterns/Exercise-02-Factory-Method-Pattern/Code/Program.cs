using System;

class Program
{
    static void Main()
    {
        DocumentFactory wordFactory = new WordDocumentFactory();

        Console.WriteLine("Creating Word Document:");
        wordFactory.ProcessDocument();

        Console.ReadLine();
    }
}