using System;

public class Product
{
    public int ProductId { get; set; }
    public string ProductName { get; set; }
    public string Category { get; set; }

    public Product(int id, string name, string category)
    {
        ProductId = id;
        ProductName = name;
        Category = category;
    }
}

public class ProductSearch
{
    // Linear Search
    public static Product LinearSearch(Product[] products, int targetId)
    {
        foreach (var product in products)
        {
            if (product.ProductId == targetId)
                return product;
        }
        return null;
    }

    // Binary Search
    public static Product BinarySearch(Product[] sortedProducts, int targetId)
    {
        int left = 0;
        int right = sortedProducts.Length - 1;

        while (left <= right)
        {
            int mid = left + (right - left) / 2;

            if (sortedProducts[mid].ProductId == targetId)
                return sortedProducts[mid];

            if (sortedProducts[mid].ProductId < targetId)
                left = mid + 1;
            else
                right = mid - 1;
        }

        return null;
    }
}

class Program
{
    static void Main()
    {
        Product[] allProducts =
        {
            new Product(102, "Wireless Mouse", "Electronics"),
            new Product(205, "Coffee Maker", "Kitchen"),
            new Product(87, "Running Shoes", "Sports"),
            new Product(301, "Desk Lamp", "Home"),
            new Product(45, "Water Bottle", "Sports"),
            new Product(156, "Bluetooth Speaker", "Electronics"),
            new Product(78, "Yoga Mat", "Fitness"),
            new Product(210, "Toaster", "Kitchen"),
            new Product(33, "Notebook", "Stationery"),
            new Product(189, "Backpack", "Travel"),
            new Product(267, "Digital Camera", "Electronics"),
            new Product(54, "Sunglasses", "Fashion"),
            new Product(198, "Air Fryer", "Kitchen"),
            new Product(76, "Dumbbell Set", "Fitness"),
            new Product(123, "External SSD", "Computers"),
            new Product(289, "Gaming Chair", "Furniture"),
            new Product(61, "Wireless Earbuds", "Audio"),
            new Product(142, "Electric Toothbrush", "Health"),
            new Product(224, "Smart Watch", "Wearables"),
            new Product(95, "Laptop Sleeve", "Accessories")
        };

        Product[] sortedProducts = new Product[allProducts.Length];
        Array.Copy(allProducts, sortedProducts, allProducts.Length);

        Array.Sort(sortedProducts,
            (p1, p2) => p1.ProductId.CompareTo(p2.ProductId));

        Console.WriteLine("LINEAR SEARCH TESTS");
        TestSearch(allProducts, 198, "Linear");
        TestSearch(allProducts, 999, "Linear");
        TestSearch(allProducts, 33, "Linear");
        TestSearch(allProducts, 95, "Linear");

        Console.WriteLine("\nBINARY SEARCH TESTS");
        TestSearch(sortedProducts, 198, "Binary");
        TestSearch(sortedProducts, 999, "Binary");
        TestSearch(sortedProducts, 33, "Binary");
        TestSearch(sortedProducts, 95, "Binary");

        Console.ReadLine();
    }

    static void TestSearch(Product[] products, int targetId, string method)
    {
        Product result = method == "Linear"
            ? ProductSearch.LinearSearch(products, targetId)
            : ProductSearch.BinarySearch(products, targetId);

        Console.WriteLine(
            $"Searching for {targetId}: " +
            (result != null
                ? $"Found {result.ProductName}"
                : "Product not found"));
    }
}