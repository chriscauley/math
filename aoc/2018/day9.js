const { range } = require('lodash')
const { mod } = require('./tools').default

const tests = [
  [10, 1618, 8317],
  [13, 7999, 146373],
  [17, 1104, 2764],
  [21, 6111, 54718],
  [30, 5807, 37305],
]

const Game = () => {
  return {
    turn: 0,
    scores: [],
    current_index: 0,
    marbles: [],
    getScores([players, last_marble, high_score]) {
      console.log(last_marble)
      const player_scores = range(players).map(() => 0)
      let last_turn
      this.scores.find((value, i) => {
        const turn = (i+1) * 23
        if (turn > last_marble) {
          return true
        }
        const player_id = (turn - 1) % players
        player_scores[player_id] += value
      })
      return Math.max(...player_scores)
    },
    step() {
      if (this.turn % 100000 === 0) {
        console.log('turn', this.turn)
      }
      if (this.turn && this.turn % 23 === 0) {
        const remove_index = mod(this.current_index-7, this.marbles.length)
        this.scores.push(this.turn + this.marbles[remove_index])
        this.marbles.splice(remove_index, 1)
        this.current_index = remove_index
        this.turn ++
        return
      }
      let new_index = ((this.current_index + 2) % this.marbles.length) || 0
      if (new_index === 0) {
        // this is effectively the same thing as the splice@0
        // but the examples show it like a push rather than an unshift
        new_index = this.marbles.length
        this.marbles.push(this.turn)
      } else {
        this.marbles.splice(new_index, 0, this.turn)
      }
      this.turn ++
      this.current_index = new_index
    }
  }
}

const game = Game()

range(7149800).forEach(() => {
  // const entries = game.marbles
  //       .map((m, i) => i === game.current_index ? `(${m})` : `${m}`)
  //       .map(s => s.padStart(3).padEnd(4))
  // console.log(`[${game.turn}] ${entries.join('')}`)
  game.step()
})

tests.forEach(([players, last_marble, high_score]) => {
  console.log(high_score, game.scores.indexOf(last_marble))
})

tests.forEach(test => {
  const highscore = game.getScores(test)
  console.log(highscore, test.pop())
})
console.log('part 1:', game.getScores([465, 71498]))
console.log('part 2:', game.getScores([465, 7149800]))