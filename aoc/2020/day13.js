const { answer, assert } = require('../2018/tools')
const { uniq, sum } = require('lodash')

const input = require('fs').readFileSync('input/13.txt', 'utf-8').trim()
const test = require('fs').readFileSync('test/13.txt', 'utf-8')

const part1 = (data) => {
  let [start, ids] = data.split('\n')
  start = Number(start)
  ids = ids.split(',').map(Number)
  let min_id = 0, min_time = Infinity
  ids.forEach(id => {
    if (!id) {
      return
    }
    const time = id-start % id
    if (min_time > time) {
      min_time = time
      min_id = id
    }
  })
  return min_id * min_time
}

const _part2 = (data) => {
  let [_start, ids] = data.split('\n')
  ids = ids.split(',').map(Number)
  const id_minute_map = {}
  ids.forEach((id, minute) => {
    if(!id) {
      return
    }
    id_minute_map[id] = minute
  })
  let id_minutes = Object.entries(id_minute_map)
        .map(([a,b]) => [Number(a),b])
        .sort((a,b) =>b[0]-a[0])
  const first = id_minutes[0]
  id_minutes = id_minutes.slice(1)
  let i = 0

  const start = new Date().valueOf()
  while (true) {
    const time = first[0] * i - first[1]
    let matched = true
    for (let index = 0;index < id_minutes.length;index ++) {
      const id = id_minutes[index][0]
      const minutes = id_minutes[index][1]
      if ((time+minutes) % id !== 0) {
        matched = false
        break
      }
    }
    i++
    if (matched) {
      // console.log(time, first[0], (time+first[1]) % first[0])
      // id_minutes.forEach(([id, minutes]) => {
      //   console.log(time, first[0], (time+minutes) % time)
      // })
      return time
    }
    if (i % 1e9 === 0) {
      console.log(i/1e9, 'billion tries', (new Date().valueOf() - start)/1000)
    }
  }
}

const ZERO = BigInt(0)
const ONE = BigInt(1)
const TWO = BigInt(2)

const modInverse = (a,m) => {
  let g = gcd(a, m);

  if(g != ONE){
    console.log("No Inverse");
  } else {
    return power(a,m-TWO,m)
  }
}

const power = (x, y, m) => {
  if(y===ZERO) return ONE;

  let p = power(x, y/TWO, m) % m;
  p = (p*p) % m;

  if(y%TWO === ZERO) return p;
  else return ((x*p) % m);
}

const gcd = (a,b) => {
  if(a===ZERO) return b;
  return gcd(b%a, a)
}

//chinese remainder theorem
const part2 = (data) => {
  data = data.split('\n')
  let [time, buses] = [data[0], data[1].split(",").map(val => Number(val) ? BigInt(val): "x")];
  let pairs = buses.map((elm, i) => {
    if(typeof(elm) === "bigint") return [elm, BigInt(i)];
  }).filter(elm => elm)
  let N = ONE;
  pairs.forEach(pair => N*=pair[0])
  let Ni = pairs.map(pair => N/pair[0]);
  let b = pairs.map((pair, i) => i===0 ? ZERO : pair[0] - pair[1] )
  let x = pairs.map((item,i) => modInverse(Ni[i], item[0]))
  let bnx = Ni.map((item, i) => item*b[i]*x[i])
  let sum = bnx.reduce((acc, cur) => acc+ cur)
  return sum - (sum/N)*N
}

const test2 = '\n17,x,13,19'
const test3 = '\n67,7,59,61'
const test4 = '\n67,x,7,59,61'
const test5 = '\n67,7,x,59,61'
const test6 = '\n1789,37,47,1889'

answer('test', part1(test), 295)
answer('input', part1(input), 222)

answer('test2', part2(test), BigInt(1068781))
answer('test2.2', part2(test2), BigInt(3417))
answer('test2.3', part2(test3), BigInt(754018))
answer('test2.4', part2(test4), BigInt(779210))
answer('test2.5', part2(test5), BigInt(1261476))
answer('test2.6', part2(test6), BigInt(1202161486))
answer('input2', part2(input), BigInt(408270049879073))