const { invert } = require('lodash')
const { mod, Geo, assert, answer, log } = require('./tools')

const CHAR_MAP = {
  '/': '/',
  '\\': '\\',
  '+': '+',
  '^': 0,
  '>': 1,
  'v': 2,
  '<': 3,
}

const REVERSE = invert(CHAR_MAP)

const prod = require('fs').readFileSync('13.txt', 'utf-8').split('\n')
const test1 = require('fs').readFileSync('_13.txt', 'utf-8').split('\n')
const test2 = require('fs').readFileSync('_13b.txt', 'utf-8').split('\n')

const parseGame = lines => {
  const xys = []
  const values = []
  const piece_dindexes = []
  const piece_xys = []
  lines.forEach((line, y) => (
    line.split('').forEach((char, x) => {
      const value = CHAR_MAP[char]
      if (typeof value === 'number') {
        piece_dindexes.push(value)
        piece_xys.push([x,y])
      } else if (value) {
        values.push(value)
        xys.push([x,y])
      }
    })
  ))

  const { board, geo } = Geo.fromPairs(xys, values)
  const pieces = {}
  const piece_turns = []
  const piece_dirs = piece_xys.map((xy, piece_id) => {
    const index = geo.xy2i(xy)
    pieces[index] = piece_id
    piece_turns.push(0)
    return geo.dindexes[piece_dindexes[piece_id]]
  })
  return {
    step: 0,
    turns: board,
    geo,
    pieces,
    piece_dirs,
    turn_map: makeTurnMap(geo),
    piece_turns,
  }
}

const makeTurnMap = (geo) => {
  const { W } = geo
  return {
    '/': {
      1: 'l',
      [W]: 'r',
      '-1': 'l',
      [`${-W}`]: 'r',
    },
    '\\': {
      1: 'r',
      [W]: 'l',
      '-1': 'r',
      [`${-W}`]: 'l',
    },
  }
}

const main = (lines, part=1) => {
  const game = parseGame(lines)
  let tick = 0
  while (tick < 1e6) {
    // printGame(game)
    stepGame(game)
    if (part === 1 && game.collision) {
      return game.collision
    } else if (Object.keys(game.pieces).length === 1) {
      return game.geo.i2xy(Object.keys(game.pieces)[0])
    }
    tick ++
  }
}

const stepGame = (game) => {
  const indexes_to_move = game.geo.indexes.filter(i => game.pieces[i] !== undefined)
  const collided = {}
  indexes_to_move.forEach(index => {
    const piece_id = game.pieces[index]
    if (piece_id === undefined) {
      // piece was removed this turn by collision
      return
    }
    const target_index = game.piece_dirs[piece_id] + index
    const target_piece_id = game.pieces[target_index]
    if (target_piece_id !== undefined) {
      game.collision = game.geo.i2xy(target_index)
      delete game.pieces[index]
      delete game.pieces[target_index]
      return
    }
    delete game.pieces[index]
    game.pieces[target_index] = piece_id

    turnPieceAtIndex(game, target_index)
  })
  game.step ++
}

const LRS_MAP = {
  s: 0,
  r: 1,
  l: -1,
}

const turnPieceAtIndex = (game, index) => {
  const turn = game.turns[index]
  if (!turn) {
    return
  }

  assert('\\/+'.includes(turn), 'Unknown turn')

  let turn_lrs
  const piece_id = game.pieces[index]
  const piece_dir = game.piece_dirs[piece_id]
  if ('\\/'.includes(turn)) {
    turn_lrs = game.turn_map[turn][piece_dir]
  } else if (turn === '+') {
    turn_lrs = 'lsr'[game.piece_turns[piece_id] % 3]
    game.piece_turns[piece_id] += 1
  } else {
    throw `invalid turn "${turn}"`
  }
  const piece_dir_index = game.geo.dindexes.indexOf(piece_dir)
  const new_dir = game.geo.dindexes[mod(piece_dir_index + LRS_MAP[turn_lrs], 4)]
  game.piece_dirs[piece_id] = new_dir
  log('turned', turn, piece_id, turn_lrs, piece_dir, game.piece_dirs[piece_id])
  log(piece_dir_index, LRS_MAP[turn_lrs])
  assert(game.geo.dindexes.includes(new_dir), `unknown velocity ${new_dir}`)
}

const printGame = (game) => {
  log('\ngame at ' + game.step)
  const board = {...game.turns}
  Object.entries(game.pieces).forEach(([index, piece_id]) => {
    const dindex = game.piece_dirs[piece_id]
    const char = REVERSE[game.geo.dindexes.indexOf(dindex)]
    board[index] = char
    // board[index] = piece_id
  })
  game.geo.print(board, {delimiter: ''})
}

answer('test1', main(test1).join(','), '7,3')
answer('prod1', main(prod).join(','), '16,45')
answer('test2', main(test2, 2).join(','), '6,4')
answer('prod1', main(prod, 2).join(','))