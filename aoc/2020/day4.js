const { answer } = require('../2018/tools')

const input = require('fs').readFileSync('input/4.txt', 'utf-8')
const test = require('fs').readFileSync('test/4.txt', 'utf-8')
const test2 = require('fs').readFileSync('test/4-2.txt', 'utf-8')

const FIELDS = {
  byr: '(Birth Year)',
  iyr: '(Issue Year)',
  eyr: '(Expiration Year)',
  hgt: '(Height)',
  hcl: '(Hair Color)',
  ecl: '(Eye Color)',
  pid: '(Passport ID)',
  cid: '(Country ID)',
}

const parse = (data) => data.split("\n\n").map(
  s => Object.fromEntries(
    s.replace(/\n/g, ' ').split(' ').map(s => s.split(':'))
  )
)

const _part1 = (data) => {
  const passports = parse(data)
  return passports.filter(passport => {
    const fields = Object.keys(passport).filter(key => key !== 'cid')
    return fields.length >= 7
  })
}

const part1 = (d) => _part1(d).length

const between = (n, bot, top) => {
  n = parseInt(n)
  return n >= bot && n <= top
}

const validators = {
  byr: ({byr}) => between(byr, 1920, 2002),
  iyr: ({iyr}) => between(iyr, 2010, 2020),
  eyr: ({eyr}) => between(eyr, 2020, 2030),
  hgt: ({hgt}) => {
    const [_, num, unit] = (hgt.match(/(\d+)(\D+)/) || [])
    if (unit === 'cm') {
      return between(num, 150, 193)
    } else if (unit === 'in') {
      return between(num, 59, 76)
    }
    return false
  },
  hcl: ({hcl}) => hcl.length === 7 && hcl.match(/^#[1-9a-f]+/),
  ecl: ({ecl}) => ['amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth'].includes(ecl),
  pid: ({pid}) => pid.length === 9 && pid.match(/^\d+$/)
}

const part2 = (data) => {
  const passports = _part1(data)
  const _validators = Object.values(validators)
  return passports.filter(
    p => !_validators.find((func) => !func(p))
  ).length
}

answer('test', part1(test), 2)
answer('input', part1(input), 250)

answer('test2', part2(test2), 4)
answer('input2', part2(input), 158)
