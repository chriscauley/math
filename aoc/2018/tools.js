const { range } = require('lodash')
const alphabetti = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.split(
  '',
)

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
    AREA: W * H,
    dindexes: [-W, 1, W, -1],
    i2xy: (i) => [mod(i, W), Math.floor(i / W)],
    xy2i: (xy) => xy[0] + xy[1] * W,
    print(board, {from_xy=[x0,y0], to_xy=[x_max, y_max], delimiter=' '}) {
      const xs = range(from_xy[0], to_xy[0]+1)
      const ys = range(from_xy[1], to_xy[1]+1)
      ys.forEach((y) => {
        const row = xs.map((x) => board[this.xy2i([x, y])]).map(s => s=== undefined ? ' ' : s)
        // eslint-disable-next-line
        console.log(row.join(delimiter))
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
  geo.look = Look(geo)
  return geo
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
  if (process.argv.includes('-v')) {
    console.log(...args)
  }
}

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
  Geo,
  assert,
  log,
  answer,
  mod
}

const test = () => {
  const geo = Geo(-5,5,-5,5)
  const board = {}
  geo.eachXY((xy) => board[geo.xy2i(xy)] = xy[1])
  geo.print(board, {delimiter:'\t'})
}

//test()