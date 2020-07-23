
with open('day1.txt', 'r') as f:
  lines = f.read().strip().split('\n')
  nums = [int(s) for s in lines]

def get_fuel(n):
  return int(n/3) - 2

fuels = [get_fuel(n) for n in nums]
print('part 1 ', sum(fuels))

corrected_fuels = []
for payload in nums:
  fuel = get_fuel(payload)
  total = 0
  while fuel > 0:
    total += fuel
    fuel = get_fuel(fuel)
  corrected_fuels.append(total)
print('part 2 ', sum(corrected_fuels))
