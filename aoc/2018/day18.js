const fs = require('fs')
const { range } = require('lodash')
const { Geo, answer, assert } = require('./tools')

const prod = fs.readFileSync('18.txt', 'utf-8').split('\n')
const test = fs.readFileSync('_18.txt', 'utf-8').split('\n')

const WALL = 'X'
const OPEN = '.'
const TREES = '|'
const LUMBER = '#'

const parse = lines => {
  const pairs = []
  const values = []
  lines.forEach((line, y) => {
    line.split('').forEach((value, x) => {
      pairs.push([x,y])
      values.push(value)
    })
    pairs.push([line.length, y])
    values.push(WALL)
  })
  return Geo.fromPairs(pairs, values)
}

const step = (geo, board) => {
  const next = {}

  const counts = {
    [OPEN]: geo.indexes.map(i => 0),
    [TREES]: geo.indexes.map(i => 0),
    [LUMBER]: geo.indexes.map(i => 0),
  }
  geo.indexes.forEach(index => {
    const value = board[index]
    if (!counts[value]) {
      return
    }
    geo.look('box', index, 1).forEach(index2 => {
      counts[value][index2] ++
    })
  })
  geo.indexes.forEach(index => {
    const value = board[index]
    next[index] = value
    if (value === WALL) {
      return
    } else if (value === OPEN && counts[TREES][index] >= 3) {
      next[index] = TREES
    } else if (value === TREES && counts[LUMBER][index] >= 3) {
      next[index] = LUMBER
    } else if (value === LUMBER) {
      if (counts[LUMBER][index] && counts[TREES][index]) {
        next[index] = LUMBER
      } else {
        next[index] = OPEN
      }
    }
  })
  return next
}

const getScore = (geo, board) => {
  const counts = {
    [OPEN]: 0,
    [TREES]: 0,
    [LUMBER]: 0,
  }
  geo.indexes.forEach(i => counts[board[i]]++)
  return counts[TREES] * counts[LUMBER]
}

const findScore = (scores, time, small_time) => {
  const score_map = {}
  const last_score = {}
  scores.forEach((score, i) => {
    score_map[score] = score_map[score] || []
    score_map[score].push(i)
  })
  const streak_indexes = Object.fromEntries(
    Object.entries(score_map)
      .filter(([k,v]) => v.length > 3)
      .map(([k, v]) => [k, v[v.length-1] - v[v.length-2]])
  )
  const streak_lengths = Object.values(streak_indexes)
  streak_lengths.forEach(s => {
    if (s !== streak_lengths[0]) {
      throw `missmatched streak in ${JSON.stringify(streak_lengths)}`
    }
  })
  const streak_length = streak_lengths[0]
  const repitition = scores.slice(-streak_length)
  const future_time = time - small_time
  const target = future_time % streak_length - 1
  console.log(future_time, target, repitition[target])
  console.log(repitition.slice(target-4, target+4))
  return repitition[target]
}

const main = (lines, time) => {
  const small_time = 700
  const total = time
  const { geo, board } = parse(lines)
  let current = board
  if (time > small_time) {
    time = small_time
  }
  const scores = []

  while (time--) {
    current = step(geo, current)
    const score = getScore(geo, current)
    scores.push(score)
  }
  if (total > small_time) {
    return findScore(scores, total, small_time)
  }
  return getScore(geo, current)
}

answer('test1', main(test, 10), 1147)
answer('prod1', main(prod, 10), 466125)
answer('test2', main(prod, 800), 211464)
answer('prod1', main(prod, 1000000000), 466125)