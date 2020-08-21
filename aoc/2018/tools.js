const { range } = require('lodash')
const alphabetti = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.split(
  '',
)
const alphanum = '0123456789abcdefghijklmnopqrstuvqxwyz'

const mod = (n, d) => ((n % d) + d) % d

const Look = (geo) => {
  const make = (shape, dist) => {
    if (dist > 0 && !look[shape][dist - 1]) {
      make(shape, dist - 1)
    }
    if (shape.startsWith('__')) {
      // dunder means "outer shell of look"
      look[shape][dist] = shapes[shape.slice(2)](dist)
    } else {
      if (!look['__' + shape][dist]) {
        // need outer shells to make filled looks
        make('__' + shape, dist)
      }
      look[shape][dist] = []
      range(dist + 1).forEach((_dist) => {
        look[shape][dist] = look[shape][dist].concat(look['__' + shape][_dist])
      })
    }
  }

  const shapes = {
    box: (dist) => {
      const out = []
      geo.dindexes.forEach((dindex, i) => {
        const o_dindex = geo.dindexes[(i + 1) % geo.dindexes.length] // orthogonal direction
        range(dist * 2 + 1).forEach((o_dist) => {
          out.push(dist * dindex + o_dist * o_dindex)
        })
        out.pop() // last corner is repeated
      })
      return out
    },
    // "up right down left"
    urdl: (dist) => geo.dindexes.map((di) => di * dist),
    circle: (dist) => {
      const out = []
      geo.dindexes.forEach((dindex, i) => {
        out.push(dindex * dist)
        const o_dindex = geo.dindexes[(i + 1) % geo.dindexes.length] // orthogonal direction
        range(1, dist).forEach((o_dist) =>
          out.push((dist - o_dist) * dindex + o_dist * o_dindex),
        )
      })
      return out
    },
  }

  const look = (shape, index, dist) => {
    if (!look[shape][dist]) {
      make(shape, dist)
    }
    return look[shape][dist].map((dindex) => index + dindex)
  }

  Object.keys(shapes).forEach((shape) => {
    look[shape] = [[]] // all geometries only see nothing at range 0
    look['__' + shape] = [[]]
    make(shape, 1)
  })

  look.inBounds = (shape, index, dist) => {
    // like look, but won't cross out of bounds
    const x0 = geo.i2xy(index)[0]
    const xys = look(shape, index, dist)
      .map((i) => geo.i2xy(i))
      .filter(
        (xy) =>
          Math.abs(xy[0] - x0) <= dist &&
          xy[1] < geo.H &&
          xy[1] >= geo.y0 &&
          xy[1] < geo.y0 + geo.H,
      )
    return xys.map((xy) => geo.xy2i(xy))
  }

  return look
}

const Geo = (x0, x_max, y0, y_max) => {
  if (y0 === undefined) {
    y_max = x_max
    x_max = x0
    x0 = 0
    y0 = 0
  }

  const W = Math.abs(x_max - x0) + 1
  const H = Math.abs(y_max - y0) + 1

  const geo = {
    x0,
    y0,
    W,
    H,
    xys: [],
    indexes: [],
    AREA: W * H,
    dindexes: [-W, 1, W, -1],
    i2xy: (i) => [mod(i, W), Math.floor(i / W)],
    xy2i: (xy) => xy[0] + xy[1] * W,
    print(board, {from_xy=[x0,y0], to_xy=[x_max, y_max], delimiter=' ',empty=' ', extras=[]}={}) {
      const xs = range(from_xy[0], to_xy[0]+1)
      const ys = range(from_xy[1], to_xy[1]+1)
      ys.forEach((y) => {
        const row = xs.map((x) => board[this.xy2i([x, y])]).map(s => s=== undefined ? empty : s)
        // eslint-disable-next-line
        console.log(row.join(delimiter),'  ', extras[y] || '')
      })
    },
    makeBoard(xys, values = []) {
      const board = {}
      xys.forEach((xy, i) => {
        board[this.xy2i(xy)] = values[i] || i
      })
      return board
    },
    inBounds(xy) {
      return xy[0] >= x0 && xy[0] < x0 + W && xy[1] >= y0 && xy[1] < y0 + H
    },
    eachXY(f) {
      console.warn('eachXY is depracated, use geo.xys.forEach instead')
      range(x0, x_max+1).forEach(
        x => range(y0, y_max+1).forEach(
          y => f([x,y])
        )
      )
    },
    slice(board, xy, W, H, _default) {
      const out = []
      const ys = range(xy[1], xy[1] + H)
      range(xy[0], xy[0]+W).forEach(
        x => ys.forEach(
          y => {
            const v = board[geo.xy2i([x,y])]
            out.push(v === undefined ? _default : v)
          }
        )
      )
      return out
    },
  }

  range(x0, x_max+1).forEach(
    x => range(y0, y_max+1).forEach(
      y => {
        const xy = [x,y]
        geo.xys.push()
        geo.indexes.push(geo.xy2i(xy))
      }
    )
  )

  geo.look = Look(geo)
  return geo
}

const SumTable = (geo, board) => {
  const sum_table = {
    getSum: (from_xy, WH) => {
      const x0 = from_xy[0]-1
      const y0 = from_xy[1]-1
      const x1 = x0 + WH[0]
      const y1 = y0 + WH[1]
      let A = sum_table[geo.xy2i([x0, y0])]
      let B = sum_table[geo.xy2i([x1, y0])]
      let C = sum_table[geo.xy2i([x0, y1])]
      const D = sum_table[geo.xy2i([x1, y1])]
      if (x0 < geo.x0) {
        A = 0
        C = 0
      }
      if (y0 < geo.y0) {
        A = 0
        B = 0
      }
      return D-B-C+A
    }
  }
  const row_sums = {}
  geo.eachXY(xy => {
    const i = geo.xy2i(xy)
    if (xy[0] === geo.x0) {
      row_sums[i] = board[i]
    } else {
      row_sums[i] = row_sums[i-1] + board[i]
    }
  })
  geo.eachXY(xy => {
    const i = geo.xy2i(xy)
    sum_table[i] = row_sums[i]
    if (xy[1] !== geo.y0) {
      sum_table[i] += sum_table[i-geo.W]
    }
  })
  return sum_table
}

Geo.fromPairs = (xys, values) => {
  const xs = xys.map((p) => p[0])
  const ys = xys.map((p) => p[1])
  const x_max = Math.max(...xs)
  const x_min = Math.min(0, ...xs)
  const y_max = Math.max(...ys)
  const y_min = Math.min(0, ...ys)
  const geo = Geo(x_min, x_max, y_min, y_max)
  return { geo, board: geo.makeBoard(xys, values) }
}

const assert = (bool, exception) => {
  if (!bool) {
    throw exception
  }
}

const log = (...args) => {
  if (log.isOn()) {
    console.log(...args)
  }
}

log.isOn = () => process.argv.includes('-v')

const answer = (text, value, expected) => {
  if (expected !== undefined) {
    assert(value === expected, `Bad answer for ${text}, ${value} !== ${expected}`)
  }
  console.log(text, value)
}

// eslint-disable-next-line
module.exports = {
  alphabetti,
  alphabet: alphabetti.slice(0,26),
  alphanum,
  Geo,
  SumTable,
  assert,
  log,
  answer,
  mod,
}

const test = () => {
  const geo = Geo(-5,5,-5,5)
  const board = {}

  geo.eachXY((xy) => board[geo.xy2i(xy)] = xy[1])
  console.log('printing -5...+5 board')
  geo.print(board, {delimiter:'\t'})

  geo.eachXY((xy) => board[geo.xy2i(xy)] = 1)
  console.log('printing sum_table of all 1s (same geo)')
  const sum_table = SumTable(geo, board)
  geo.print(sum_table, {delimiter: '\t'})
  answer('sum of 9 cells', sum_table.getSum([-5,-5], [3,3]), 9)
  answer('sum of 4 cells', sum_table.getSum([-4,-4], [2, 2]), 4)
  answer('sum of 4 tall cells', sum_table.getSum([-4,-4], [1, 4]), 4)
  answer('sum of 4 wide cells', sum_table.getSum([-4,-4], [4, 1]), 4)
}

if (require.main === module) {
  test()
}