const fs = require('fs')
const {range, sortBy, sum} = require('lodash')
const { Geo, answer, log, alphanum } = require('./tools')

const OPEN = '.'

const prod = fs.readFileSync('15.txt', 'utf-8').split('\n')

const text = fs.readFileSync(`_15.txt`, 'utf-8').replace(/-->/g, ' ')
let tests = text.split('----').map((text, test_no) => {
  const lines = text.trim().split('\n')
  const last = lines.pop()
  const match = last.match(/Outcome: (\d+) \* (\d+) = (\d+) - (\d+)/)
  const [_, rounds, hp, expected, expected2 ] = match
  const input = []
  const final = []
  const healths = []
  lines.forEach((line,y) => {
    const match = line.match(/(\S+)\s+(\S+)\s*(.*)/)
    input.push(match[1])
    final.push(match[2])
    match[3] && match[3].split(', ').forEach(s => {
      const [_, type, health] = s.match(/(.).(\d+)/)
      healths.push({y, type, health})
    })
  })
  return { rounds, hp, expected, expected2, input, final, healths, name: `test${test_no}` }
})

tests.push({input: prod, name: 'prod', total: '193476', total2: '36768'})

const initGame = ({input, expected, expected2, name}, power) => {
  const game = {
    expected,
    expected2,
    input,
    name
  }
  const xys = []
  const pieces = []
  let id = 0
  game.input.forEach(
    (line,y) => line.split('').forEach(
      (type,x) => {
        if (type !== '#') {
          xys.push([x,y])
          if (type !== '.') {
            pieces.push({xy: [x, y], hp: 200, type, id: id++})
          }
        }
      }
    )
  )
  const { geo } = Geo.fromPairs(xys, xys.map(() => OPEN))
  // this problem wants to check N, W, E, S instead of clockwise
  // so delete the looks (they will be regenerated) and sort the dindexes
  geo.look.circle.pop()
  geo.look.__circle.pop()
  geo.dindexes = sortBy(geo.dindexes, i => i)

  pieces.forEach(p => {
    p.index = geo.xy2i(p.xy)
    delete p.xy
  })
  Object.assign(game, {
    geo,
    indexes: xys.map(xy => geo.xy2i(xy)),
    pieces,
    moves: [],
    dead: [],
    turn: 0,
    power,
  })
  return game
}

const print = (game, board) => {
  board = board || cloneBoard(game)
  const extras = range(game.geo.H).map(() =>[])
  extras.push([])
  extras.push([])
  extras.push([])
  game.pieces.forEach(p => {
    const xy = game.geo.i2xy(p.index)
    extras[xy[1]].push(`${p.type}(${p.hp})`)
  })
  console.log("after ",game.turn, " rounds")
  game.geo.print(board, {delimiter:'', empty: 'X', extras: extras.map(e => e.join(' '))})
}

const cloneBoard = (game) => {
  const board = {}
  game.pieces.forEach(p => board[p.index] = p.type)
  game.indexes.forEach(index => board[index] = board[index] || OPEN)
  return board
}

const floodFill = (geo, board, index, enemy) => {
  const valid = []
  const targets = geo.look('circle', index, 1).map(i => [i, i, 0])
  let i_targets = 0
  while (i_targets < targets.length) {
    const [start, index2, depth] = targets[i_targets]
    if (board.done < depth) {
      i_targets ++
      continue
    }
    const target_piece = board[index2]
    if (target_piece === enemy) {
      valid.push(start)
      board.done = depth
    } else if (board[index2] === OPEN) {
      board[index2] = alphanum[depth]
      geo.look('circle', index2, 1).forEach(i3 => targets.push([start, i3, depth+1]))
    }
    i_targets ++
  }
  return valid
}

const movePiece = (game, piece) => {
  const check = game.geo.look('circle', piece.index, 1)
  const board = cloneBoard(game)
  const enemy = piece.type === 'E' ? 'G' : 'E'
  const adjacents = check.filter(i => board[i] === enemy)
  if (adjacents.length) {
    attackPiece(game, piece, adjacents)
    return
  }
  if (game.locked) {
    return
  }
  const targets = floodFill(game.geo, board, piece.index, enemy)
  if (targets.length) {
    piece.index = targets[0]
    const new_adjacents = game.geo.look('circle', piece.index, 1).filter(i => board[i] === enemy)
    if (new_adjacents.length) {
      attackPiece(game, piece, new_adjacents)
    }
    return true
  }
}

const attackPiece = (game, piece, indexes) => {
  const targets = indexes.map(index => game.pieces.find(p => p.index === index))
  const target = sortBy(targets, 'hp')[0]
  target.hp -= piece.type === 'G' ? 3 : game.power
  log(piece.type, piece.id, 'attacked', target)
  if (target.hp <= 0) {
    target.dead = true
    delete target.index
    game.dead.push(piece)
    game.pieces = game.pieces.filter(p => !p.dead)
  }
}


const stepGame = (game) => {
  // movePiece(game, game.pieces[0])
  // movePiece(game, game.pieces[8])
  const counts = { E: 0, G: 0 }
  let moved
  game.pieces.forEach((p) => {
    if (!p.dead && !game.over) {
      moved = movePiece(game, p) || moved
      if (!game.pieces.find(p => p.type === 'E') || !game.pieces.find(p => p.type === 'G')) {
        game.over = true
      }
    }
  })
  if (game.over) {
    return
  }
  game.turn ++
  if (moved) {
    game.pieces = sortBy(game.pieces, 'index')
    // print(game)
    // game.locked = true
  }
}

const runGame = (game) => {
  let i = 200
  let victor
  while (i--) {
    stepGame(game)
    if (game.over) {
      log(game.pieces)
      const total_hp = sum(game.pieces.map(p=> p.dead ? 0 : p.hp))
      victor = game.pieces[0].type
      game.score = game.turn * total_hp
      game.counts = {
        E: game.pieces.filter(p => p.type === 'E').length,
        G: game.pieces.filter(p => p.type === 'G').length,
      }
      log(`${victor}@${game.power}`,game.turn,'*', total_hp,'=', game.score)
      break
    }
  }
  return victor
}

// tests = tests.slice(0,1)
tests.forEach(test => {
  const game = initGame(test, 3)
  runGame(game)
  // print(game)
  answer(`${game.name}-p1`,game.score.toString(), game.expected)
})
console.log()
tests.forEach(test => {
  let victor
  let power = 4
  let game2
  while (true) {
    game2 = initGame(test, power)
    const elves = game2.pieces.filter(p => p.type === 'E').length
    victor = runGame(game2)
    if (game2.pieces.filter(p => p.type === 'E').length === elves) {
      break
    }
    power ++
  }
  answer(`${game2.name}-p1`,game2.score.toString(), game2.expected2)
})
