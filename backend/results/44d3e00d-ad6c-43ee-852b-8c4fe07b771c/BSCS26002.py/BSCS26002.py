def fact(n):
    if n == 0:
        return 1
    else:
        return n * fact(n - 1)

number = 5
print(f"The factorial {fact(number)}")