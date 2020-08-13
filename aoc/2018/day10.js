const { range } = require('lodash')
const { Geo } = require('./tools').default

const prod = require('fs').readFileSync('10.txt', 'utf-8').trim().split('\n')
const test = require('fs').readFileSync('_10.txt', 'utf-8').trim().split('\n')

const lines = prod
const points = lines.map(line => {
  line = line.replace(/ /g,'').replace("position=<",'').replace(">velocity=<",',').replace(">", '')
  const [x, y, dx, dy] = line.split(',').map(v => parseInt(v))
  return {x, y, dx, dy}
})

let w_min=Infinity, h_min=Infinity, s_min, frame_min
let s = 0
let last_w = Infinity, last_h = Infinity, last_board, last_geo
while (true) {
  if (s%100 == 0) {
    console.log(`After ${s} seconds`)
  }
  let frame = points.map(({x, y, dx, dy}) => [x + s*dx, y + s*dy])
  const { geo, board } = Geo.fromPairs(frame, frame.map(() => "#"))
  if (geo.W>last_w && geo.H>last_h) {
    const x_min = Math.min(...frame.map(f=>f[0]))
    const y_min = Math.min(...frame.map(f=>f[1]))
    frame = frame.map(f=> [f[0]-x_min, f[1]-y_min])
    console.log(frame)
    console.log("Message at ", s-1)
    last_geo.print(last_board)
    break
  }
  last_h = geo.H
  last_w = geo.W
  last_geo = geo
  last_board = board
  s ++
}
