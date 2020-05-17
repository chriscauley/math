const {range } = require('lodash')
const data = require('./data')

const test = (a, b) => {
  if (a !== b) {
    throw `AssertionError: ${a} !== ${b}`
  }
}

const p1 = (max) => {
  let sum = 0
  let i3 = 3
  while (i3 < max) {
    sum += i3
    i3 += 3
  }
  let i5 = 5
  while (i5 < max) {
    if (i5 % 3) {
      sum += i5
    }
    i5 += 5
  }
  return sum
}

const p2 = max => {
  let sum = 0
  let n1 = 0
  let n2 = 1
  while (n2 < max) {
    if (n2 % 2 === 0) {
      sum += n2
    }
    const next = n1 + n2
    n1 = n2
    n2 = next
  }
  return sum
}

const p3 = num => {
  let factor = Math.floor(Math.sqrt(num))
  while (factor > 1) {
    if (num % factor === 0) {
      if (isPrime(factor)) {
        return factor
      }
    }
    factor --
  }
}

const isPalindrome = number => {
  const s = number.toString()
  for (var i=0; i < s.length / 2; i++) {
    if (s[i] !== s[s.length-i-1]) {
      return false
    }
  }
  return true
}

const p4 = upper_bound => {
  let max_palindrome = 0
  let n1 = upper_bound
  while(n1) {
    let n2 = upper_bound - 1
    if (n1 * n2 < max_palindrome) {
      break
    }
    while (n2) {
      const test_n = n1 * n2
      if (test_n < max_palindrome) {
        break
      }
      if (isPalindrome(test_n)) {
        max_palindrome = test_n
      }
      n2 --
    }
    n1 --
  }
  return max_palindrome
}

const getPrimeFactors = (number, primes=[2,3,5,7,11,13,17,19]) => {
  const factors = []
  let i_prime = 0
  while (number > 1) {
    const prime = primes[i_prime]
    if (!prime) {
      throw "Primes to short to find prime factors for "+number
    }
    while (number % prime === 0) {
      factors.push(prime)
      number = number / prime
    }
    i_prime ++
  }
  return factors
}

const p5 = target => {
  const factor_count = {}
  while (target) {
    const factors = getPrimeFactors(target)
    const _count = {}
    factors.forEach(factor => {
      _count[factor] = (_count[factor] || 0) + 1
    })
    Object.entries(_count).forEach(([key,value]) => {
      factor_count[key] = Math.max(value, factor_count[key] || 0)
    })
    target --
  }

  let prod = 1
  Object.entries(factor_count).forEach(([key, value]) => {
    while(value--) {
      prod *= key
    }
  })
  return prod
}

const p6 = target => {
  let sum = 0
  let sum_of_squares = 0
  let i = 0
  while (i < target) {
    i++
    sum += i
    sum_of_squares += i*i
  }
  return sum*sum - sum_of_squares
}

const isPrime = number => {
  let factor = Math.floor(Math.sqrt(number))
  while (factor > 1) {
    if (number % factor === 0) {
      return false
    }
    factor --
  }
  return true
}

const cache_primes = (() => {
  const cache = {}

  const _cache_primes = (max) => {
    let primes = range(1, max + 1)
    let i = 0
    let flops = 0
    while (i++ < primes.length + 1) {
      const prime = primes[i]
      let back_i = primes.length
      while (back_i-- > i+1) {
        flops += 1
        if (primes[back_i] % prime === 0) {
          primes .splice(back_i,1)
        }
      }
    }
    console.log('flops', flops)
    return primes
  }
  return (max) => {
    if (!cache[max]) {
      cache[max] = _cache_primes(max)
    }
    return cache[max]
  }
})()

const p7 = target => {
  return cache_primes(2e5)[target]
}

const p8 = target => {
  let max = 0
  const numbers = data.p8.split('').map(n => parseInt(n))
  for (var i=0;i<data.p8.length;i++) {
    let prod = 1
    for (var i2=i;i2<i+target;i2++) {
      prod *= numbers[i2]
    }
    if (prod > max) {
      max = prod
    }
  }
  return max
}

module.exports = {
  p1: () => test(p1(1000), 233168),
  p2: () => test(p2(4e6), 4613732),
  p3: () => test(p3(600851475143), 6857),
  p4: () => test(p4(999), 906609),
  p5: () => test(p5(20), 232792560),
  p6: () => test(p6(100), 25164150),
  p7: () => test(p7(10001), 104743),
  p8: () => test(p8(13), 23514624000),
  test: {
    p1: () => test(p1(10), 23),
    p2: () => test(p2(90), 2 + 8 + 34),
    p3: () => test(p3(13195), 29),
    p4: () => test(p4(99), 9009),
    p5: () => test(p5(10), 2520),
    p6: () => test(p6(10), 2640),
    p7: () => test(p7(6), 13),
    p8: () => test(p8(4), 5832),
  }
}