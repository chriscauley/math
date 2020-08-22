const fs = require('fs')
const { Geo, answer, log} = require('./tools')
const { range } = require('lodash')

const prod = fs.readFileSync('17.txt', 'utf-8').trim().split('\n')
const test = fs.readFileSync('_17.txt', 'utf-8').trim().split('\n')
let XMIN = 500
let YMAX = 0

const WALL = '#'
const FALL = '|'
const FILL = '~'

const parse = lines => {
  const pairs = [[500,0]]
  const values = ['+']
  const rangify = (s) => {
    s = s.split('=')[1]
    const nums = s.split('..').map(i => parseInt(i))
    if (nums.length === 1) {
      nums.push(nums[0])
    }
    return range(nums[0], nums[1]+1)
  }
  lines.forEach(line => {
    const items = line.split(', ')
    if (line[0][0] === 'y') {
      items.reverse()
    }
    const [xs, ys] = items.map(rangify)
    const size = Math.max(xs.length, ys.length)
    if (xs[0] < XMIN) {
      XMIN = xs[0]
    }
    YMAX = Math.max(ys[ys.length-1], YMAX)
    for (let i=0;i<size;i++) {
      pairs.push([xs[i%xs.length], ys[i%ys.length]])
      values.push(WALL)
    }
  })
  // XMIN = 0
  XMIN -=5
  values.push(' ')
  pairs.forEach(p => p[0] = p[0] - XMIN)
  const XMAX = Math.max(...pairs.map(xy => xy[0]))
  pairs.push([XMAX+20, 0])
  values.push(' ')
  return Geo.fromPairs(pairs, values)
}

const fill = (board, current) => {
  const D = board.W
  const U = -D
  const R = 1
  const L = -1

  const isEmpty = (index) => !board[index] || board[index] === FALL

  while (isEmpty(current+D)) {
    board[current+D] = FALL
    current = current + D
    const xy = board.geo.i2xy(current)
    if (xy[1] >= YMAX) {
      return
    }
    if (board[current+D] === FALL) {
      return
    }
  }
  const drop = []
  while (drop.length === 0) {
    let x0 = current
    let x1 = current
    let level = []
    while(isEmpty(x0)) {
      level.push(x0)
      if (isEmpty(x0+D)) {
        drop.push(x0)
        break
      }
      x0 --
    }
    while(isEmpty(x1)) {
      level.push(x1)
      if (isEmpty(x1+D)) {
        drop.push(x1)
        break
      }
      x1 ++
    }
    level.forEach(i => board[i] = drop.length ? FALL : FILL)
    current = current +U
    if (drop.length === 0) {
      // the first item in a layer get's counted twice
      board.filled += level.length -1
    }
  }
  board.springs = board.springs.concat(drop)
  return
}

const main = input => {
  const {geo, board}= parse(input)
  board.W = geo.W
  board.H = geo.H
  board.geo = geo
  board.filled = 0
  board.springs = [500-XMIN]
  console.log("<pre>")
  let i_spring = 0
  while(i_spring < board.springs.length) {
    fill(board, board.springs[i_spring])
    i_spring++
    if (geo.i2xy(board.springs[i_spring])[1] > YMAX) {
      break
    }
  }
  console.log('filled', board.filled)
  console.log(i_spring)
  const extras = range(YMAX).map(y => [y])
  board.springs.forEach(i => {
    const xy = board.geo.i2xy(i)
    extras[xy[1]].push(xy[0])
  })
  let total = 0
  console.log('z', Object.values(board).filter(v => v === '|' || v === '~').length)
  geo.print(board, {delimiter: '', extras: extras.map(extra => extra.join('  ')), to_xy:[geo.W-1, YMAX+20]})
  console.log("</pre>")
}

// main(test)
main(prod)