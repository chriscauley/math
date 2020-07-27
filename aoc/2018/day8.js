const { range, sum } = require('lodash')
const { alphabetti } = require('./tools').default

const prod = require('fs').readFileSync('8.txt', 'utf-8').trim()
const test = '2 3 0 3 10 11 12 1 1 0 1 99 2 1 1 2'
const text = prod

const numbers = text.split(" ").map(i => parseInt(i))
const nodes = []


const buildNode = (start) => {
  const node = {
    start,
    child_count: numbers[start],
    meta_count: numbers[start+1],
    name: alphabetti[nodes.length],
  }
  node.length = 2 + node.meta_count
  nodes.push(node)
  start += 2
  node.children = range(node.child_count).map(() => {
    const child = buildNode(start)
    node.length += child.length
    start += child.length
    return child
  })
  node.meta = numbers.slice(start, start + node.meta_count)
  if (node.child_count === 0) {
    node.value = sum(node.meta)
  } else {
    node.value = sum(node.meta.map(meta_value => {
      const child = node.children[meta_value-1]
      return child ? child.value : 0
    }))
  }
  return node
}

buildNode(0)
console.log("part 1:", sum(nodes.map(n => sum(n.meta))))
console.log("part 2:", nodes[0].value)