const { answer, assert } = require('../2018/tools')
const { uniq, sum } = require('lodash')

const input = require('fs').readFileSync('input/10.txt', 'utf-8').split('\n').map(Number)
const test = require('fs').readFileSync('test/10.txt', 'utf-8').split('\n').map(Number)

const part1 = (nums) => {
  let jolts = 0
  let gaps = new Array(4).fill(0)
  nums = nums.slice().sort((a, b)=> a - b)
  nums.push(nums[nums.length-1]+3)
  nums.forEach(num => {
    const gap = num - jolts
    gaps[gap] ++
    jolts = num
  })
  return gaps[1] * gaps[3]
}

const part2 = (nums) => {
  nums = nums.slice().sort((a, b)=> a - b)
  const builtInt = nums[nums.length-1]+3
  let l = 0
  const diffs = {}

  nums.unshift(0)
  nums.push(builtInt)
  nums=nums.reverse()
  const poss = {}
  const len = {}
  len[builtInt] = 1

  nums.forEach((elem)=>{
    poss[elem] = nums.filter(el=>el>elem && el <=elem+3)
    if(elem!==builtInt){
      len[elem] = 0
      for(let i=0;i<poss[elem].length;i++){
        len[elem] += len[poss[elem][i]]
      }
    }
  })
  return len[0]
}

answer('test', part1(test), 220)
answer('input', part1(input), 1885)

answer('test2', part2(test))
answer('input2', part2(input))
