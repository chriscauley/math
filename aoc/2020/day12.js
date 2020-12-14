const { answer, assert } = require('../2018/tools')
const { uniq, sum } = require('lodash')

const input = require('fs').readFileSync('input/12.txt', 'utf-8').trim()
const test = require('fs').readFileSync('test/12.txt', 'utf-8')

const dir2pos = {N:1, S: 1, E: 0, W:0}
const dir2mag = {N:1, S: -1, E: 1, W: -1}
const dirs = ['N', 'E', 'S', 'W']

const part1 = (data) => {
  const instructions = data.split('\n')
  const pos = [0,0]
  let cur_dir = 'E'

  const rotate = degrees => {
    // extra dirs.length is to correct for how js mods negative numbers
    const index = dirs.indexOf(cur_dir) + (degrees / 90) + dirs.length
    cur_dir = dirs[index % dirs.length]
  }

  instructions.forEach(string => {
    const command = string[0]
    const value = parseInt(string.slice(1))
    if (command === 'F') {
      pos[dir2pos[cur_dir]] += value * dir2mag[cur_dir]
    } else if (command === 'L') {
      rotate(-value)
    } else if (command === 'R') {
      rotate(value)
    } else if (!dirs.includes(command)) {
      throw `Bad command ${string} ${command}`
    } else {
      pos[dir2pos[command]] += value * dir2mag[command]
    }
  })
  return Math.abs(pos[0]) +  Math.abs(pos[1])
}

const part2 = (data) => {
  const instructions = data.split('\n')
  const pos = [0,0]
  let waypoint = [10,1]
  let cur_dir = 'E'

  const rotate = degrees => {
    // extra dirs.length is to correct for how js mods negative numbers
    let turns = ((degrees / 90) + 4)%4
    while(turns --) {
      const [x, y] = waypoint
      waypoint = [y, -x]
    }
  }

  instructions.forEach(string => {
    const command = string[0]
    const value = parseInt(string.slice(1))
    if (command === 'F') {
      pos[0] += value * waypoint[0]
      pos[1] += value * waypoint[1]
    } else if (command === 'L') {
      rotate(-value)
    } else if (command === 'R') {
      rotate(value)
    } else if (!dirs.includes(command)) {
      throw `Bad command ${string} ${command}`
    } else {
      waypoint[dir2pos[command]] += value * dir2mag[command]
    }
  })
  return Math.abs(pos[0]) +  Math.abs(pos[1])
}

answer('test', part1(test), 25)
answer('input', part1(input), 1603)

answer('test2', part2(test), 286)
answer('input2', part2(input), 52866)
