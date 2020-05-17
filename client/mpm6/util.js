import { last } from 'lodash'
const MAX_BALANCE = 9007199254740991 / 2
const MAX_TURNS = 100
const TARGET = 1e6

const reverse = ({ penultimate }) => {
  let today = penultimate
  let tomorrow = TARGET
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
  return test({ deposit1, deposit2 })
}

const reverseSearch = ({ upper_bound, lower_bound }, store) => {
  let current = lower_bound - 1
  let tries = 0
  let best_result = { turns: 0 }
  let timeout
  const start = new Date().valueOf()
  const total = upper_bound - lower_bound + 1
  const step = 1e5
  const next = () => {
    clearTimeout(timeout)

    // randomizing target slightly just makes the progress meter look more organic
    const target = current + step + Math.random() * 1000
    while (current <= target && current < upper_bound) {
      current++
      tries++
      const result = reverse({ penultimate: current })

      // all results pass, choosing which one's to keep will be left to saveResult
      if (result.turns > best_result.turns) {
        best_result = result
      }
    }
    if (current < upper_bound) {
      timeout = setTimeout(next, 0)
    }
    store.actions.setProgress({
      progress: {
        start,
        now: new Date().valueOf(),
        completed: tries / total,
        success: tries,
        current,
        timeout,
      },
      best_result,
    })
  }
  next()
}

const test = ({ deposit1, deposit2 }) => {
  const balances = [deposit1, deposit2 + deposit1]
  let turns = MAX_TURNS
  while (balances[balances.length - 1] !== TARGET && turns) {
    const last_two = balances.slice(balances.length - 2)
    balances.push(last_two[0] + last_two[1])
    turns--
  }

  const final = last(balances)
  const success = final === TARGET
  if (!success) {
    while (balances.length > 2) {
      if (balances[balances.length - 2] < TARGET) {
        break
      }
      balances.pop()
    }
  }

  return {
    key: `${deposit1},${deposit2}`,
    turns: balances.length,
    balances,
    success,
    final,
    deposit1,
    deposit2,
    datetime: new Date().valueOf(),
    penultimate: balances[balances.length - 2],
  }
}

const search = ({ upper_bound, lower_bound }, store) => {
  let tries = 0
  let success = 0
  let timeout
  const start = new Date().valueOf()
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
      start,
      now: new Date().valueOf(),
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
