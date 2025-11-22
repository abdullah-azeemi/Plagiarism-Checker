def factorial(n):
    if n == 0:
        return 1
    
    return n * factorial(n - 1)
number = 1
print(f"The factorial of {number} is: {factorial(number)}")