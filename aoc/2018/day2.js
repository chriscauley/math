const fs = require('fs')

const prod = fs.readFileSync('2.txt', 'utf-8').split('\n')
const test = 'abcde\nfghij\nklmno\npqrst\nfguij\n\naxcye\nwvxyz'.split('\n')

const lines = prod

const counts = {
  2: 0,
  3: 0
}

lines.forEach(line => {
  const hist = {}
  line.split('').forEach(letter => {
    hist[letter] = (hist[letter] || 0) +1
  })
  const values = Object.values(hist)
  if (values.includes(2)) {
    counts[2] ++
  }
  if (values.includes(3)) {
    counts[3] ++
  }
})
console.log('part 1: ', counts[2] * counts[3])

const used = {}
let match
lines.find(line => {
  return line.split('').find((_, i) => {
    const value = line.slice(0,i) + "*" + line.slice(i+1)
    if (used[value]) {
      console.log('part 2: ', value.replace("*", ''))
      return true
    }
    used[value] = true
  })
})