const { answer, assert } = require('../2018/tools')
const { sum } = require('lodash')

const input = require('fs').readFileSync('input/7.txt', 'utf-8')
const test = require('fs').readFileSync('test/7.txt', 'utf-8')
const test2 = require('fs').readFileSync('test/7-2.txt', 'utf-8')

const parseRules = (data) => {
  const rules = data.replace(/ bags?\.?/g,'').trim().split('\n')
  const rule_map = {'no other': []}
  rules.forEach(r => {
    const [outer, inners] = r.split(' contain ')
    inners.split(', ').forEach(inner => {
      rule_map[outer] = rule_map[outer] || []
      rule_map[outer].push(inner)
    })
  })
  return rule_map
}

const part1 = (data) => {
  const rule_map = parseRules(data)

  const findShiny = color => {
    if (!color) {
      return false
    }
    // console.log(color, rule_map[color])
    if (rule_map[color].join(',').includes('shiny gold')) {
      return true
    }
    return rule_map[color].find(c => findShiny(c.split(/\d+ /)[1]))
  }
  return sum(Object.keys(rule_map).filter(findShiny).fill(1))
}

const part2 = (data) => {
  const rule_map = parseRules(data)
  const countBags = color => {
    return 1 + sum(rule_map[color].map(rule => {
      if (rule === 'no other') {
        return 0
      }
      const count = parseInt(rule.match(/\d+/))
      const color = rule.replace(/\d+ /, '')
      return count * countBags(color)
    }))
  }
  return countBags('shiny gold') - 1
}


answer('test', part1(test), 4)
answer('input', part1(input),197)

answer('test2', part2(test), 32)
answer('test2-2', part2(test2), 126)
answer('input2', part2(input), 85324)