const fs = require('fs')

const lines = fs.readFileSync('1.txt', 'utf-8').split('\n').map(i => parseInt(i))
let sum = 0

lines.forEach(i => sum += i)
const touched = {}

let i = 0
let value = 0
while (!touched[value]) {
  touched[value] = true
  value += lines[i % lines.length]
  i++
}

console.log(value)