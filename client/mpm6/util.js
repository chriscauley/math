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
  const deposit2 = tomorrow - yesterday
  return test(deposit1, deposit2)
}

const reverseSearch = () => {
  const PENULTIMATE_MAX = 10000000
  let max_turns = 0
  let best_result
  for (let penultimate = 1; penultimate < PENULTIMATE_MAX; penultimate++) {
    const result = reverse(penultimate)
    if (result.turns > max_turns) {
      max_turns = result.turns
      best_result = result
    }
    const result2 = reverse(-penultimate)
    if (result2.turns > max_turns) {
      max_turns = result2.turns
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
    key: `${deposit1},${deposit2}`,
    turns: balances.length,
    balances,
    success: final === 1e6,
    final,
    deposit1,
    deposit2,
    datetime: new Date().valueOf(),
  }
}

const search = ({ upper_bound, lower_bound }, store) => {
  let tries = 0
  let success = 0
  let timeout
  if (lower_bound > upper_bound) {
    const temp = upper_bound
    upper_bound = lower_bound
    lower_bound = temp
  }
  const total = Math.pow(upper_bound - lower_bound + 1, 2)
  let deposit1 = lower_bound
  let deposit2 = lower_bound
  const next = () => {
    clearTimeout(timeout)
    if (deposit1 <= upper_bound) {
      while (deposit2 <= upper_bound) {
        const result = test({ deposit1, deposit2 })
        tries++
        deposit2++
        if (result.success) {
          store.actions.saveResult(result)
          success += 1
        }
      }
      deposit2 = lower_bound
      deposit1++
      timeout = setTimeout(next, 0)
    }
    store.actions.setProgress({
      completed: tries / total,
      success,
      deposit1,
      deposit2,
      timeout,
    })
  }
  next()
}

export default {
  reverse,
  reverseSearch,
  test,
  search,
}
