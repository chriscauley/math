with open('2.txt', 'r') as f:
    nums = [int(s) for s in f.read().split(',')]
    nums[1] = 12
    nums[2] = 2

tests = [
    [[1,9,10,3,2,3,11,0,99,30,40,50], 3500],
    [[1,0,0,0,99], 2],
    [[2,3,0,3,99], 2],
    [[2,4,4,5,99,0], 2],
    [[1,1,1,4,99,5,6,0,99], 30],
]

def run_program(nums):
    nums = nums[:] # copy so it doesn't modify existing list
    for i in range(int(len(nums) /4)):
        code, i1, i2, i3 = nums[i*4:(i+1)*4]
        if code == 99:
            break
        if code == 1:
            nums[i3] = nums[i1] + nums[i2]
        if code == 2:
            nums[i3] = nums[i1] * nums[i2]
    return nums[0]

for q, a in tests:
    r = run_program(q)
    if r != a:
        print(f'Fail! For {q} expected {a} but got {r}')

print('part 1', run_program(nums))

def search_program(nums, target):
    for p1 in range(100):
        for p2 in range(100):
            new_nums = nums[:]
            new_nums[1] = p1
            new_nums[2] = p2
            result = run_program(new_nums)
            if result == target:
                return p1*100+ p2

print(search_program(nums, 19690720))