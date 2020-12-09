const { answer, assert } = require('../2018/tools')
const { sum } = require('lodash')

const input = require('fs').readFileSync('input/8.txt', 'utf-8').split('\n')
const test = require('fs').readFileSync('test/8.txt', 'utf-8').split('\n')

const part1 = (lines) => {
  const state = {
    jmp: 0,
    acc: 0,
    visited: {}
  }
  while (!state.visited[state.jmp]) {
    if (state.jmp >= lines.length) {
      return 'pass-'+state.acc
    }
    state.visited[state.jmp] = true
    const [term, value] = lines[state.jmp].split(' ')
    if (term !== 'jmp') {
      state.jmp ++
    }
    state[term] += parseInt(value)
  }
  return 'fail-'+state.acc
}

const part2 = (lines) => {
  let ans = ''
  lines.find((line, line_no) => {
    const _lines = lines.slice()
    if (line.startsWith('jmp')) {
      _lines[line_no] = line.replace('jmp', 'nop')
      ans = part1(_lines)
    } else if (line.startsWith('nop')) {
      _lines[line_no] = line.replace('nop', 'jmp')
      ans = part1(_lines)
    }
    return ans.startsWith('pass')
  })
  return ans
}

answer('test', part1(test), 'fail-5')
answer('input', part1(input), 'fail-1489')

answer('test2', part2(test), 'pass-8')
answer('input2', part2(input), 'pass-1539')