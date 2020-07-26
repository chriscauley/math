const { range } = require('lodash')

const prod = require('fs').readFileSync('3.txt', 'utf-8').split('\n')
const test = "#1 @ 1,3: 4x4\n#2 @ 3,1: 4x4\n#3 @ 5,5: 2x2".split('\n')

const lines = prod

let x_max = 0
let y_max = 0

const mod = (n, d) => ((n%d)+d)%d
const Geo = (W, H) => {
  return {
    i2xy: (i) => [mod(i,W), Math.floor(i / W)],
    xy2i: (xy) => xy[0] + xy[1] * W,
    print(board) {
      range(H).forEach(y => {
        console.log(range(W).map(x => board[this.xy2i([x, y])] || " ").join(""))
      })
    }
  }
}

const claims = lines.map(line=> {
  let [_, id, x, y, w, h] = line.match(/#(\d+) @ (\d+),(\d+): (\d+)x(\d+)/).map(i => parseInt(i))
  x_max = Math.max(x_max, x + w) + 1
  y_max = Math.max(y_max, y + h) + 1
  return { id, x, y, w, h }
})
const map = {}
const pass = {}
let conflicts = 0
const geo = Geo(x_max, y_max)

claims.forEach(({x, y, w, h, id}) => {
  pass[id] = true
  range(h).forEach(dy => {
    range(w).forEach(dx => {
      const index = geo.xy2i([x+dx, y+dy])
      if (map[index] === undefined) {
        map[index] = id
      } else {
        delete pass[map[index]]
        delete pass[id]
        if (map[index] !== 'x') {
          conflicts += 1
        }
        map[index] = 'x'
      }
    })
  })
})
// console.log(map)
// geo.print(map)

console.log("Part 1:", conflicts)
console.log("Part 2:", pass)