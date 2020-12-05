const { answer } = require('../2018/tools')
const { range } = require('lodash')

const test = 'BFFFBBFRRR\nFFFBBBFRRR\nBBFFBBFRLL'

const input = require('fs').readFileSync('input/5.txt', 'utf-8')

const ids = []

const part1 = (data) => {
  let max_id = 0
  const items = data.split('\n')
  items.forEach(item => {
    let rows = range(128)
    let cols = range(8)
    item.split('').forEach(l => {
      if (l === 'F') {
        rows = rows.slice(0, rows.length / 2)
      }
      if (l === 'B') {
        rows = rows.slice(rows.length / 2)
      }
      if (l === 'L') {
        cols = cols.slice(0, cols.length / 2)
      }
      if (l === 'R') {
        cols = cols.slice(cols.length / 2)
      }
    })
    const id = rows[0] * 8 + cols[0]
    ids.push(id)
    if (id > max_id) {
      max_id = id
    }
  })
  return max_id
}

answer('test', part1(test), 820)
answer('input', part1(input), 855)

ids.sort()

let last = 100
ids.slice(2).find(i => {
  if (i !== last && i-last !== 1) {
    last = i
    return true
  }
  last = i
})
answer('input2', last-1, 552)
