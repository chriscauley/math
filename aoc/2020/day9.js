const { answer, assert } = require('../2018/tools')
const { uniq, sum } = require('lodash')

const input = require('fs').readFileSync('input/9.txt', 'utf-8').split('\n').map(i=>parseInt(i))
const test = require('fs').readFileSync('test/9.txt', 'utf-8').split('\n').map(i=>parseInt(i))

const part1 = (nums, preamble) => {
  assert(!nums.includes(0), 'numbers includes zero')
  assert(!nums.find(i => i < 0), 'numbers are not all positive')
  return nums.find((num, index) => {
    if (index < preamble) {
      return false
    }
    const candidates = nums.slice(index-preamble, index)
    return ! candidates.find((num2, index2) => {
      const target = num - num2
      return candidates.includes(target, index2+1)
    })
  })
}

const part2 = (nums, preamble) => {
  const ans1 = part1(nums, preamble)
  let range
  nums.find((num, index) => {
    let total = num
    let index2 = index
    while (total < ans1) {
      index2 ++
      total += nums[index2]
    }
    if (total === ans1) {
      range = nums.slice(index, index2+1)
      return true
    }
  })
  assert(sum(range) === ans1, 'Range does not match sum')
  return Math.min(...range)+Math.max(...range)
}

answer('test', part1(test, 5), 127)
answer('input', part1(input, 25), 15353384)

answer('test2', part2(test, 5), 62)
answer('input2', part2(input, 25))
