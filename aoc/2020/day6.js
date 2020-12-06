const { answer } = require('../2018/tools')
const { uniq } = require('lodash')

const input = require('fs').readFileSync('input/6.txt', 'utf-8')
const test = require('fs').readFileSync('test/6.txt', 'utf-8')

const part1 = (data) => {
  const groups = data.split('\n\n')
  let total = 0
  groups.forEach(group => {
    total += uniq(group.replace(/\n/g,'').split('')).length
  })
  return total
}

answer('test', part1(test), 11)
answer('input', part1(input),6703)

const part2 = (data) => {
  const groups = data.split('\n\n')
  let total = 0
  groups.forEach(group => {
    const [first, ...rest] = group.split('\n')
    first.split('').forEach(letter => {
      if (!rest.find(r => !r.includes(letter))) {
        total += 1
      }
    })
  })
  return total
}

answer('test', part2(test), 6)
answer('input', part2(input), 3430)
