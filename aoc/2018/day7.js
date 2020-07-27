const { flatten, range } = require('lodash')
const { alphabet } = require('./tools').default

const prod = require('fs').readFileSync('7.txt', 'utf-8').trim()
const test = `Step C must be finished before step A can begin.
Step C must be finished before step F can begin.
Step A must be finished before step B can begin.
Step A must be finished before step D can begin.
Step B must be finished before step E can begin.
Step D must be finished before step E can begin.
Step F must be finished before step E can begin.`
const text = prod

const steps = text.split('\n').map(
  s => s.match(/Step (\w) must be finished before step (\w) can begin./)
).map(m => [m[1], m[2]])
const starts = {}
const map = {}
let done = {}

const keys = Array.from(new Set(flatten(steps)))
keys.sort()
keys.forEach(k => {
  map[k] = { from: [], to: [] }
  starts[k] = true
})

steps.forEach(([a, b]) => {
  map[b].from.push(a)
  map[a].to.push(b)
  delete starts[b]
})

let do_now = Object.keys(starts)
do_now.sort()
let order = ''

while (do_now.length) {
  const current = do_now.shift()
  if (!done[current]) {
    order += current
  }
  done[current] = true
  map[current].to.forEach(key => {
    if (do_now.includes(key) && done[key]) {
      return
    }
    if (map[key].from.find(key2 => !order.includes(key2))) {
      return
    }
      do_now.push(key)
  })
  do_now.sort()
}
console.log('part 1:', order)

// part 2
const ALPHABET = alphabet.map(l => l.toUpperCase())
do_now = Object.keys(starts)
let offset = 0
let workers = range(2)
let started = {}
order = ''
const working_on = []
if (text === prod) {
  offset = 60
  workers = range(5)
}

let now = 0
const busy_until = workers.map(() => 0)

while (order.length < Object.keys(map).length) {
  const free_workers = workers.filter(worker => busy_until[worker] <= now)
  let __new = false
  free_workers.forEach(worker => {
    // add freed tasks to the queue
    const old_task = working_on[worker]
    if (old_task) {
      order += old_task
      map[old_task].to.forEach(key => {
        if (started[key] || order.includes(key)) {
          return
        }
        if (map[key].from.find(key2 => !order.includes(key2))) {
          return
        }
        do_now.push(key)
      })
      do_now.sort()
      working_on[worker] = undefined
    }
  })
  const done_workers = workers.filter(worker => busy_until[worker] <= now)
  done_workers.forEach(worker => {
    const new_task = do_now.shift()
    if (new_task) {
      started[new_task] = true
      working_on[worker] = new_task
      busy_until[worker] = now + ALPHABET.indexOf(new_task) + offset + 1
      __new = true
    }
  })
  if (order.length >= Object.keys(map).length) {
    break
  }
  const output = [now, ...working_on.map((task, i) => `${i}-${task || ' '}`)]
  output.push(order)
  // __new && console.log(output.join('\t'))
  now ++
}
console.log('part 2:', now)
