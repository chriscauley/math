import { last } from 'lodash'
const MAX_BALANCE = 9007199254740991 / 2
const MAX_TURNS = 100
const final = 1e6

const reverse = (penultimate) => {
  let today = penultimate
  let tomorrow = final
  let yesterday

  const r_balances = [tomorrow, today]
  let turns = 0
  while (turns < MAX_TURNS) {
    if (Math.abs(tomorrow - today) > MAX_BALANCE) {
      break
    }
    yesterday = tomorrow - today
    tomorrow = today
    today = yesterday
    r_balances.push(today)
    turns++
  }

  if (!turns) {
    throw 'Ran out of turns'
  }

  const deposit1 = today
  const deposite2 = tomorrow - yesterday

  const balances = [deposit1, deposit1 + deposite2]
  let pass = false
  for (let i2 = 0; i2 < MAX_TURNS + 2; i2++) {
    const last_two = balances.slice(balances.length - 2)
    balances.push(last_two[0] + last_two[1])
    if (balances[balances.length - 1] === final) {
      pass = true
      break
    }
  }
  if (!pass) {
    throw 'WTF'
  }
  return {
    turns,
    balances,
    deposit1,
    deposite2,
  }
}

const reverseSearch = () => {
  const PENULTIMATE_MAX = 10000000
  let max_turns = 0
  let best_result
  for (let penultimate = 1; penultimate < PENULTIMATE_MAX; penultimate++) {
    const result = reverse(penultimate)
    if (result.turns > max_turns) {
      max_turns = result.turns
      // console.log(result)
      best_result = result
    }
    const result2 = reverse(-penultimate)
    if (result2.turns > max_turns) {
      max_turns = result2.turns
      // console.log(result2)
      best_result = result2
    }
  }
  test(best_result)
}

const test = ({ deposit1, deposit2 }) => {
  const balances = [deposit1, deposit2 + deposit1]
  let turns = MAX_TURNS
  while (balances[balances.length - 1] !== 1e6 && turns) {
    const last_two = balances.slice(balances.length - 2)
    balances.push(last_two[0] + last_two[1])
    turns--
  }

  const final = last(balances)

  return {
    balances,
    success: final !== 1e6,
    final,
    deposit1,
    deposit2,
  }
}

export default {
  reverse,
  reverseSearch,
  test,
}
