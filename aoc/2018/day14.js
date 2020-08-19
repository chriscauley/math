const { range, isEqual } = require('lodash')
const { answer, log } = require('./tools')

const prod = 540391
const prod2 = [5,4,0,3,9,1]
const test1 = [
  [9, '5158916779'],
  [5, '0124515891'],
  [18, '9251071085'],
  [2018, '5941429882']
]

const test2 = [ '51589', '01245', '92510', '59414'].map(s => s.split('').map(i => parseInt(i)))
const ans2 = []
let prod_ans
let last6

const max_size = prod + 10

const nums = [3, 7]
let elf1 = 0
let elf2 = 1
let last

const step = () => {
  const sum = nums[elf1] + nums[elf2]
  sum.toString().split('').forEach(c => nums.push(parseInt(c)))
  elf1 = (elf1 + nums[elf1] + 1) % nums.length
  elf2 = (elf2 + nums[elf2] + 1) % nums.length
  if (!prod_ans) {
    if (nums.lastIndexOf(prod2[0]) === nums.length-6) {
      if (isEqual(nums.slice(-6), prod2)) {
        prod_ans = nums.length-6
      }
    }
    if (nums.lastIndexOf(prod2[0]) === nums.length-7) {
      if (isEqual(nums.slice(-7,-1), prod2)) {
        prod_ans = nums.length-7
      }
    }
  }
  if (nums.length % 1000000 === 0) {
    log(nums.length/1000000, "e6", last6)
  }
}

const print = () => {
  const s = nums.map((num, i) => {
    if (i === elf1) {
      return `(${num})`
    } else if (i === elf2) {
      return `(${num})`
    } else {
      return ` ${num} `
    }
  })
  console.log(s.join(''))
}

const main1 = (input) => {
  return nums.slice(input, input+10).join('')
}

while(nums.length < max_size || ! prod_ans) {
  step()
  if (nums.length > 21e6) {
    throw 'oops'
  }
}

test1.forEach(([input, expected], i) => {
  answer('test1-'+i, main1(input), expected)
})

answer('prod1', main1(prod), '1474315445')
answer('prod2', prod_ans, )