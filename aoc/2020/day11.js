const { answer, assert } = require('../2018/tools')
const { uniq, sum } = require('lodash')

const input = require('fs').readFileSync('input/11.txt', 'utf-8')
const test = require('fs').readFileSync('test/11.txt', 'utf-8')

const FLOOR = '.'
const EMPTY = 'L'
const FILLED = '#'
const BREAK = '\n'

const parse = data => {
  const W = data.indexOf('\n')+1
  return {
    board: data.split(''),
    W,
    turn: 0,
    box: [-W-1, -W, -W+1, -1, 1, W-1, W, W+1],
  }
}

const countNearby = (game, i) => {
  return game.box.filter(di => game.board[i+di] === FILLED).length
}

const analyze = (game, count=countNearby) => {
  const counts = game.board.map((value, i) => {
    if (value === FLOOR || value === BREAK) {
      return value
    }
    return count(game,i)
  })
  console.log("\ncounts", game.turn)
  console.log(counts.join(''))
}

const print = game => {
  console.log('\n---Turn---',game.turn)
  console.log(game.board.join(''))

}

const tick = (game, count, cutoff=4) => {
  game.board = game.board.map((value, i) => {
    if (value === FLOOR || value === BREAK) {
      return value
    } else if (value === EMPTY) {
      return count(game, i) === 0 ? FILLED : EMPTY
    } else if (value === FILLED) {
      return count(game, i) >= cutoff ? EMPTY : FILLED
    }
    throw `Unknown value: ${value}`
  })
  game.turn ++
}

const part1 = (data) => {
  const game = parse(data)
  let last, count = 0
  while (last !== count && game.turn < 1000) {
    last = count
    tick(game, countNearby)
    count = game.board.filter(v => v === FILLED).length
  }
  return count
}

const countNearby2 = (game, i) => {
  // look in each direction of box until a FILLED or EMPTY is seen
  return game.box.filter(di => {
    let dist = 1
    while (true) {
      const value = game.board[di * dist+i]
      if (value === FILLED) {
        return true
      } else if (value !== FLOOR) {
        // if value is empty, break, or undefined, keep looking
        // this is equivalent to !== FLOOR
        return false
      }
      dist ++
      if (dist > 100) {
        throw 'z'
      }
    }
  }).length
}

const part2 = (data) => {
  const game = parse(data)
  let last, count = 0
  while (last !== count && game.turn < 1000) {
    last = count
    tick(game, countNearby2, 5)
    count = game.board.filter(v => v === FILLED).length
  }
  return count
}

answer('test', part1(test), 37)
answer('input', part1(input), 2281)

answer('test2', part2(test), 26)
answer('input2', part2(input), 2085)
