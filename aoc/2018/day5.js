const prod = require('fs').readFileSync('5.txt', 'utf-8').trim()
const test = 'dabAcCaCBAcCcaDA'

const text = prod

const eliminations = []
const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('')
const _r = s => new RegExp(s, 'g')
alphabet.forEach(l => {
  eliminations.push(_r(l + l.toUpperCase()))
  eliminations.push(_r(l.toUpperCase()+l))
})

const reduce = polymer => {
  let i = 0
  while (i < polymer.length - 1) {
    const a = polymer[i]
    const b = polymer[i + 1]
    if (a !== b && a.toLowerCase() === b.toLowerCase()) {
      polymer = polymer.slice(0, i) + polymer.slice(i+2)
      i = Math.max(i-1, 0)
    } else {
      i++
    }
  }
  return polymer
}

const reduce2 = (polymer, count=0) => {
  let _new = polymer
  eliminations.forEach(e => {
    _new = _new.replace(e, '')
  })
  if (polymer.length !== _new.length) {
    _new = reduce(_new, count +1)
  }
  return _new
}

const timeit = (f, n=10) => {
  const start = new Date().valueOf()
  const out = f()
  while (n > 0) {
    f()
    n--
  }
  console.log(out.length, new Date().valueOf() - start)
}

const remove_and_reduce = polymer => {
  const lengths = alphabet.map(letter => {
    const p2 = polymer.replace(new RegExp(letter, 'ig'), '')
    return reduce2(p2).length
  })
  lengths.sort()
  return lengths[0]
}

// timeit(() => reduce(text))
// timeit(() => reduce2(text)) // ~10x faster~

console.log('part 1:', reduce2(text).length)
console.log('part 1:', remove_and_reduce(text))
