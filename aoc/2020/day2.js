const { answer } = require('../2018/tools')

const input = require('fs').readFileSync('input/2.txt', 'utf-8')
const test = '1-3 a: abcde\n1-3 b: cdefg\n2-9 c: ccccccccc'

const main = data => {
  data = data.replace(/-/g, ' ').replace(/:/g, '')
  const matched = data.split('\n').filter(line => {
    const [low, high, letter, pw] = line.split(' ')
    const matches = (pw.match(new RegExp(letter, 'g')) || []).length
    return matches >= low && matches <= high
  })
  return matched.length
}

answer('test', main(test), 2)
answer('input', main(input), 536)

const main2 = data => {
  data = data.replace(/-/g, ' ').replace(/:/g, '')
  const matched = data.split('\n').filter(line => {
    const [low, high, letter, pw] = line.split(' ')
    let matches = 0
    pw[low-1] === letter && matches ++
    pw[high-1] === letter && matches ++
    return matches === 1
  })
  return matched.length
}

answer('test', main2(test), 1)
answer('input', main2(input))
