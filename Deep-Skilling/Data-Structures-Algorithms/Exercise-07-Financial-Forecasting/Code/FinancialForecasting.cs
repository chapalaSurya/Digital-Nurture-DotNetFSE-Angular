using System;

class Program
{
    static void Main()
    {
        Console.WriteLine("Financial Forecasting Tool\n");

        double initialValue = 1000.0;
        double[] growthRates = { 0.05, 0.07, 0.03 };
        int forecastYears = growthRates.Length;

        double futureValue = CalculateFutureValue(
            initialValue,
            growthRates,
            forecastYears);

        Console.WriteLine($"Initial Investment : ${initialValue:F2}");
        Console.WriteLine($"Forecast Period    : {forecastYears} Years");
        Console.WriteLine($"Projected Value    : ${futureValue:F2}");

        Console.ReadLine();
    }

    static double CalculateFutureValue(
        double currentValue,
        double[] growthRates,
        int remainingYears)
    {
        // Base Case
        if (remainingYears == 0)
        {
            return currentValue;
        }

        int currentIndex = growthRates.Length - remainingYears;

        double nextValue =
            currentValue * (1 + growthRates[currentIndex]);

        return CalculateFutureValue(
            nextValue,
            growthRates,
            remainingYears - 1);
    }
}