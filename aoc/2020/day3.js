const { answer } = require('../2018/tools')

const input = require('fs').readFileSync('input/3.txt', 'utf-8')
const test = require('fs').readFileSync('test/3.txt', 'utf-8')

const part1 = (data,[dx, dy] = [3, 1]) => {
  const rows = data.split('\n').map(r => r.split(''))
  let x=0, trees = 0
  rows.forEach((row, ir) => {
    if (ir % dy !== 0) {
      return
    }
    x = x % row.length
    if (row[x] === '#') {
      trees ++
      row[x] = 'X'
    } else {
      row[x] = 'O'
    }
    x += dx
  })
  return trees
}

const part2 = (data) => {
  const rows = data.split('\n').map(r => r.split(''))
  const slopes = [
    [1, 1],
    [3, 1],
    [5, 1],
    [7, 1],
    [1, 2]
  ]
  const counts = slopes.map(dxy => part1(data, dxy))
  return counts.reduce((i, t) => i * t,1)
}

answer('test', part1(test), 7)
answer('input', part1(input))

answer('test2', part2(test), 336)
answer('input2', part2(input), 2122848000)
