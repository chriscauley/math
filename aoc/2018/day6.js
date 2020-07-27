const { Geo, alphabetti } = require('./tools').default
const { range, sortBy } = require('lodash')

const prod = require('fs').readFileSync('6.txt', 'utf-8').trim()
const test = `1, 1\n1, 6\n8, 3\n3, 4\n5, 5\n8, 9`
const text = prod
const d_part2 = text === test ? 32 : 10000

const pairs = text
  .split('\n')
  .map((line) => line.split(', ').map((i) => parseInt(i)))
const { geo, board } = Geo.fromPairs(pairs, alphabetti)
const inverted = {}
const areas = {}

const oob = { '.': 0 }
let total = 0
let last_total
Object.entries(board).forEach(([index, value]) => {
  inverted[value] = parseInt(index)
  board[index] = value.toUpperCase()
  areas[value] = 1
  oob[value] = 0
})

const board2 = { ...board }

let dist = 1

while (last_total !== total) {
  last_total = total

  // mark spaces for this round
  Object.entries(inverted).forEach(([_value, index]) => {
    geo.look.inBounds('__circle', index, dist).forEach((index2) => {
      if (board[index2] === undefined) {
        board[index2] = dist
        total += 1
      } else if (board[index2] === dist) {
        board[index2] = '.'
      }
    })
  })

  // repaint this rounds spaces with values (for visual confirmation)
  Object.entries(inverted).forEach(([value, index]) => {
    geo.look.inBounds('__circle', index, dist).forEach((index2) => {
      if (board[index2] === dist) {
        board[index2] = value
        areas[value]++
      }
    })
  })

  dist += 1
  if (dist > geo.W || dist > geo.H) {
    console.err(board)
    throw 'dist too big'
  }
}

const edges = []

range(geo.W).forEach((x) => {
  edges.push(board[geo.xy2i([x, 0])])
  edges.push(board[geo.xy2i([x, geo.H - 1])])
})
range(geo.H).forEach((y) => {
  edges.push(board[geo.xy2i([0, y])])
  edges.push(board[geo.xy2i([geo.W - 1, y])])
})
edges.forEach((e) => (oob[e] += 1))

const scores = sortBy(
  Object.entries(areas).filter(([id, _area]) => !oob[id]),
  (s) => s[1],
)
console.warn('part 1:', scores.pop()[1])

// part 2
const dist_board = {}
const indexes = range(geo.W * geo.H)
const xys = indexes.map((i) => geo.i2xy(i))
let safe = 0
indexes.forEach((i) => (dist_board[i] = 0))
pairs.forEach((pair_xy) => {
  xys.forEach((xy, index) => {
    dist_board[index] +=
      Math.abs(pair_xy[0] - xy[0]) + Math.abs(pair_xy[1] - xy[1])
  })
})
indexes.forEach((index) => {
  if (dist_board[index] < d_part2) {
    board2[index] = '#'
    safe += 1
  }
})
console.warn('part 2:', safe)
