const { answer } = require('../2018/tools')

const prod = require('fs').readFileSync('input/1.txt', 'utf-8')
const test = '1721\n979\n366\n299\n675\n1456'

const main = data => {
  const numbers = data.split('\n').map(i => parseInt(i))
  const exists = {}
  const result = numbers.find(n => {
    const target = 2020-n
    if (exists[target]) {
      return true
    }
    exists[n] = true
  })
  return result * (2020-result)
}

answer('test', main(test), 514579)
answer('prod', main(prod), 1015476)

const main2 = data => {
  const numbers = data.split('\n').map(i => parseInt(i))
  const first_numbers = numbers.filter(n => n > 2020/2)
  const second_numbers = numbers.filter(n => n <= 2020/2)
  const sums = {}
  second_numbers.forEach((n1, i) => {
    second_numbers.slice(i+1).forEach(n2 => {
      sums[n1 +n2] = [n1, n2]
    })
  })
  let result
  const first_number = numbers.find(n => {
    const target = 2020 - n
    if (sums[target]) {
      result = n * sums[target][0] * sums[target][1]
    }
    return result
  })
  return result
}

answer('test2', main2(test), 241861950)
answer('prod2', main2(prod), 200878544)