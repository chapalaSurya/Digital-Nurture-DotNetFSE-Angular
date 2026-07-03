CREATE DATABASE IF NOT EXISTS OnlineRetailStore;
USE OnlineRetailStore;
CREATE TABLE Products (
    ProductID INT PRIMARY KEY AUTO_INCREMENT,
    ProductName VARCHAR(100) NOT NULL,
    Category VARCHAR(50) NOT NULL,
    Price DECIMAL(10,2) NOT NULL
);
INSERT INTO Products (ProductName, Category, Price) VALUES
-- Electronics
('iPhone 15', 'Electronics', 79999.00),
('Samsung Galaxy S24', 'Electronics', 74999.00),
('OnePlus 12', 'Electronics', 64999.00),
('Redmi Note 13', 'Electronics', 18999.00),
('Boat Earphones', 'Electronics', 1999.00),

-- Furniture
('Office Chair', 'Furniture', 12999.00),
('Wooden Dining Table', 'Furniture', 24999.00),
('Sofa Set', 'Furniture', 34999.00),
('Bookshelf', 'Furniture', 5999.00),
('Bed Frame', 'Furniture', 15999.00),

-- Clothing
('Leather Jacket', 'Clothing', 6999.00),
('Denim Jeans', 'Clothing', 1999.00),
('Formal Shirt', 'Clothing', 1499.00),
('Sneakers', 'Clothing', 3999.00),
('Winter Coat', 'Clothing', 7999.00),

-- Groceries
('Basmati Rice 10kg', 'Groceries', 999.00),
('Olive Oil 1L', 'Groceries', 799.00),
('Almonds 500g', 'Groceries', 599.00),
('Honey 500g', 'Groceries', 349.00),
('Green Tea Pack', 'Groceries', 299.00);
SELECT * FROM Products;
SELECT 
    ProductID,
    ProductName,
    Category,
    Price,
    ROW_NUMBER() OVER (PARTITION BY Category ORDER BY Price DESC) AS RowNum
FROM Products;
SELECT 
    ProductID,
    ProductName,
    Category,
    Price,
    RANK() OVER (PARTITION BY Category ORDER BY Price DESC) AS RankNum
FROM Products;
SELECT 
    ProductID,
    ProductName,
    Category,
    Price,
    DENSE_RANK() OVER (PARTITION BY Category ORDER BY Price DESC) AS DenseRankNum
FROM Products;
SELECT 
    ProductID,
    ProductName,
    Category,
    Price,
    ROW_NUMBER() OVER (PARTITION BY Category ORDER BY Price DESC) AS RowNum,
    RANK()       OVER (PARTITION BY Category ORDER BY Price DESC) AS RankNum,
    DENSE_RANK() OVER (PARTITION BY Category ORDER BY Price DESC) AS DenseRankNum
FROM Products
ORDER BY Category, Price DESC;
WITH RankedProducts AS (
    SELECT 
        ProductID,
        ProductName,
        Category,
        Price,
        DENSE_RANK() OVER (PARTITION BY Category ORDER BY Price DESC) AS RankNum
    FROM Products
)
SELECT ProductID, ProductName, Category, Price, RankNum
FROM RankedProducts
WHERE RankNum <= 3
ORDER BY Category, RankNum;
