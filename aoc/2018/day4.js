const { range } = require('lodash')

const prod = require('fs').readFileSync('4.txt', 'utf-8')
const test = `[1518-11-01 00:00] Guard #10 begins shift
[1518-11-01 00:05] falls asleep
[1518-11-01 00:25] wakes up
[1518-11-01 00:30] falls asleep
[1518-11-01 00:55] wakes up
[1518-11-01 23:58] Guard #99 begins shift
[1518-11-02 00:40] falls asleep
[1518-11-02 00:50] wakes up
[1518-11-03 00:05] Guard #10 begins shift
[1518-11-03 00:24] falls asleep
[1518-11-03 00:29] wakes up
[1518-11-04 00:02] Guard #99 begins shift
[1518-11-04 00:36] falls asleep
[1518-11-04 00:46] wakes up
[1518-11-05 00:03] Guard #99 begins shift
[1518-11-05 00:45] falls asleep
[1518-11-05 00:55] wakes up`

const text = prod
const lines = text.trim().split('\n')
lines.sort()
const shift_map = {}
const sleep_counts = {}
const minute_counts = {}
let guard
let lasttime
let last_minute

lines.forEach(line => {
  const time = line.match(/\[(.*)\]/)[1]
  const [hour, minute] = time.split(' ').pop().split(":")
  const m = parseInt(minute)
  const h = parseInt(hour)
  if (line.includes("begins shift")) {
    guard = line.match(/#(\d+)/)[1]
    if (!shift_map[guard]) {
      shift_map[guard] = []
      sleep_counts[guard] = 0
      minute_counts[guard] = range(60).map(() => 0)
    }
  } else if (line.includes("falls asleep")) {
    shift_map[guard].push(['sleep', time])
    lasttime = new Date(time)
    last_minute = m
  } else if (line.includes("wakes up")) {
    shift_map[guard].push(['wake', time])
    const minutes = (new Date(time) - lasttime) / 60000
    sleep_counts[guard] += minutes
    range(minutes).forEach(dm => {
      minute_counts[guard][(last_minute+dm)%60] += 1
    })
  } else {
    throw "bad line " + line
  }
})

let max_guard
let max_total = 0
let max_minute
let max_guard2
let max_value = 0
let max_minute2
Object.entries(sleep_counts).forEach(([guard_id, total]) => {
  const _max_value = Math.max(...minute_counts[guard_id])
  if (total > max_total) {
    max_total = total
    max_guard = guard_id
    max_minute = minute_counts[guard_id].indexOf(_max_value)
  }
  if (_max_value > max_value) {
    max_value = _max_value
    max_guard2 = guard_id
    max_minute2 = minute_counts[guard_id].indexOf(_max_value)
  }
})
console.log("part 1:", max_minute * max_guard)
console.log("part 2:", max_minute2 * max_guard2)