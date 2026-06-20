public abstract class DocumentFactory
{
    public abstract IDocument CreateDocument();

    public void ProcessDocument()
    {
        IDocument doc = CreateDocument();

        doc.Open();
        doc.Save();
        doc.Close();
    }
}