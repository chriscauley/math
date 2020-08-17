const { range, sum } = require('lodash')
const { assert, answer, log } = require('./tools')

const prod = require('fs').readFileSync('12.txt', 'utf-8').trim().split('\n')
const test = require('fs').readFileSync('_12.txt', 'utf-8').trim().split('\n')

const l_pad = range(10).map(() => '.').join('')

const step = (current, rules) => {
  current = '..' + current  + "..."
  return range(current.length-4).map(i => {
    const llcrr = current.slice(i,i+5)
    return rules[llcrr] || '.'
  }).join('')
}

const print_nums = (final_day) => {
  let out = '    '
  range(l_pad).forEach(() => out += ' ')
  range(Math.floor(final_day.length / 10)).forEach(i => {
    out += '0123456789abcdefghij'[i]
    out += '         '
  })
  log(out)
}

const getPotScore = current => {
  return sum(current.split('').map((p,i) => (
    p === "#" ? i-l_pad.length : 0
  )))
}

const main = (lines, generations) => {
  assert(lines[0].startsWith('initial'), "bad first line: "+lines[0])
  assert(!lines[1], `second line has text: "${lines[2]}"`)
  const days = [l_pad + lines[0].split(': ').pop()]
  const rules = {}
  lines.slice(2).forEach(l => {
    const [rule, result] = l.split(" => ")
    rules[rule] = result
  })
  range(generations).forEach((i) => {
    let current = days[days.length-1] + '.'
    assert(current.indexOf("#") > 2, "Current day has plant too close to front"+current)
    // const r_pad = 2 - current.lastIndexOf("#") - current.length
    days.push(step(current, rules))
  })
  if( generations === 20) {
    // part 1 analysis
    print_nums(days[days.length-1])
    days.forEach((d, i) => {
      const s = i.toString().padStart(2) + ": "
      log(s+d.slice(7))
    })
  } else {
    //part 2 analysis
    let last = 0
    const changes = []
    days.forEach((d, i) => {
      const now = getPotScore(d)
      changes.push(now - last)
      last = now
    })
    log(changes.slice(generations-30))
  }
  return getPotScore(days[days.length-1])
}

answer('test: ', main(test, 20), 325)
answer('prod1: ', main(prod, 20), 3241)
answer('prod1: ', main(prod, 200) + (5e10-200) * 55, 2749999999911)