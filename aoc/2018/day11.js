const { range, sum } = require('lodash')
const { Geo, assert, log, answer } = require('./tools')

const test1a = 18
const test1b = 42
const prod = 7511

const getPowerLevel = (xy, input) => {
  const x = xy[0]
  const y = xy[1]
  const rack_id = x + 10
  const power_level =  (rack_id * y + input) * rack_id
  const digits = power_level.toString()
  return parseInt(digits.charAt(digits.length-3) || '0') - 5
}

const power_tests = [
  [122,79,57,-5],
  [217,196,39,0],
  [101,153,71,4],
]
power_tests.forEach(([x,y,input,expected]) => {
  const level = getPowerLevel([x,y],input)
  assert(level == expected, `getPowerLevel(${x},${y},${input}) should equal ${expected} but got ${level}`)
})

const find_max_sum = (geo, board, size=3) => {
  const sums = []
  const xys = []

  geo.eachXY((xy) => {
    const index = geo.xy2i(xy)
    sums.push(sum(geo.slice(board, xy, size, size, 0)))
    xys.push(xy)
  })

  const max_sum = Math.max(...sums)
  const max_xy = xys[sums.indexOf(max_sum)]
  return { max_sum, max_xy }
}

const main = (input, part=1) => {
  const size = 300
  const geo = Geo(1, size, 1, size)
  const board = {}

  geo.eachXY((xy) => {
    const index = geo.xy2i(xy)
    board[index] = getPowerLevel(xy, input)
  })

  const { max_sum, max_xy } = find_max_sum(geo, board, 3)
  log(`input ${input} had a max sum of ${max_sum} at xy ${max_xy}`)
  if (part === 1) {
    return max_xy.toString()
  }

  const max_sums = []
  const max_xys = []
  const sizes = []
  range(4, 20).forEach(size => {
    log(size, '/', 300)
    const { max_sum, max_xy } = find_max_sum(geo, board, size)
    max_sums.push(max_sum)
    max_xys.push(max_xy)
    sizes.push(size)
  })

  const max_max_sum = Math.max(...max_sums)
  const max_max_xy = max_xys[max_sums.indexOf(max_max_sum)]
  const max_size = sizes[max_sums.indexOf(max_max_sum)]
  log(`input ${input} had a max max sum of ${max_max_sum} at xy ${max_max_xy},${max_size}`)
  return `${max_max_xy},${max_size}`
}

answer('test1a:', main(test1a), '33,45')
answer('test1b:', main(test1b), '21,61')
answer('prod1:', main(prod), '21,22')
answer('prod2:', main(prod, 2), '235,288,13')