def meets_criteria(n):
    s = str(n)
    double = False
    for i, n1 in enumerate(s[:-1]):
        n2 = s[i+1]
        if n1 > n2:
            return False
        double = double or n1 == n2
    return double

def tripple_criteria(n):
    s = str(n)
    last = ''
    streak = 0
    for d in s:
        if d == last:
            streak += 1
        else:
            if streak == 2:
                return True
            streak = 1
            last = d
    return streak == 2

tests = [111111, 223450, 123789]
assert [meets_criteria(n) for n in tests] == [True, False, False]

tests2 = [112233, 123444, 111122]

assert [tripple_criteria(n) for n in tests2] == [True, False, True]

answers = []
answers2 = []
for n in range(146810, 612564+1):
    if meets_criteria(n):
        answers.append(n)
        if tripple_criteria(n):
            answers2.append(n)
print(len(answers))
print(len(answers2))