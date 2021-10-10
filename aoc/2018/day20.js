const { assert, Geo } = require('./tools')

const test1 = '^ENWWW(NEEE|SSE(EE|N))$'
const test2 = '^ESSWWN(E|NNENN(EESS(WNSE|)SSS|WWWSSSSE(SW|NNNE)))$'
const test3 = '^WSSEESWWWNW(S|NENNEEEENN(ESSSSW(NWSW|SSEN|WSWWN(E|WWS(E|SS)))))$'
const prod = require('fs').readFileSync('_day20.txt', 'utf-8')

const splitAt = (string, char) => {
  const split_at = string.indexOf(char)
  const a = string.slice(0, split_at)
  const b = string.slice(split_at+1)
  return [a, b]
}

const parse = text => {
  if (!text.includes('(')) {
    return { steps: text, children: []}
  }
  const [steps, rest ] = splitAt(text, '(')
  const out = { steps, doors: 0 }
  if (rest) {
    console.log(text)
    assert(rest[rest.length-1] === ')', 'Last character assumed to be paren: '+rest)
    out.children = splitAt(rest.slice(0, rest.length-1), '|').map(s => parse(s))
  }
  return out
}

const clean = (text) => {
  text = text.replace('^', '').replace('$', '')
  const removes = ['NS', 'SN', 'EW', 'WE', '(|)','()']
  let last_length
  while (last_length !== text.length) {
    removes.forEach(r => text = text.replace(r, ''))
    last_length = text.length
  }
  return text
}

const explore = (board, tree) => {
  const { geo, directions } = board
  const { steps, children, start } = tree
  let current = start
  steps.split('').forEach(s => {
    tree.doors++
    const dindex = directions[s]
    current += dindex
    board[current] = Math.abs(dindex) === 1 ? '|' : '-'
    current += dindex
    board[current] = '.'
    const [x, y] = geo.i2xy(current)
    board.x_min = Math.min(x, board.x_min)
    board.x_max = Math.max(x, board.x_max)
    board.y_min = Math.min(y, board.y_min)
    board.y_max = Math.max(y, board.y_max)
  })
  if (board.max_doors < tree.doors) {
    board.max_doors = tree.doors
    board.max_path = tree
  }
  children.forEach( (child) => {
    child.start = current
    child.doors = tree.doors
    explore(board, child)
  })
}

const main = (text) => {
  text = clean(text)
  const SIZE = 18
  const tree = parse(text)
  const geo = Geo(SIZE, SIZE)
  const C = Math.floor(SIZE/4) * 2+1
  tree.start = geo.xy2i([C, C])
  const board = {
    x_max: C,
    x_min: C,
    y_min: C,
    y_max: C,
    max_doors: 0,
    geo,
    directions: {
      N: -geo.W,
      S: geo.W,
      E: 1,
      W: -1,
    }
  }
  geo.indexes.forEach(i=> {
    const [x, y] = geo.i2xy(i)
    if (x % 2 === 1 && y % 2 ===1) {
      board[i] = ' '
    } else if (x % 2 === 1 || y % 2 === 1) {
      board[i] = '?'
    } else {
      board[i] = '#'
    }
  })
  board[tree.start] = 'X'
  explore(board, tree)
  const { x_max, x_min, y_max, y_min } = board
  console.log(geo.print(board, {from_xy: [x_min-1, y_min-1], to_xy: [x_max+1, y_max+1]}))
  console.log(board.max_path)
}

main(test3)