import React from 'react'
import css from '@unrest/css'

import BalanceSheet from './BalanceSheet'
import Navigation from './Navigation'
import util from './util'

const link = (
  <a
    className={css.link()}
    target="_blank"
    href="https://www.think-maths.co.uk/BankBalance"
    rel="noopener noreferrer"
  >
    Million Bank Balance Puzzle
  </a>
)

export default function Step0() {
  return (
    <div className={css.grid.row()}>
      <div className={css.grid.col12()}>
        <h2 className={css.h2()}>Million Bank Balance Puzzle</h2>
        <div>
          <p>
            This is my solution for the {link} by Matt Parker. For a full
            description please checkout the video on his site. Briefly
            described, you must choose two initial deposit amounts for a bank
            account on days 1 and 2. On the third day, the deposit is equal to
            the balance two days prior. The goal is to find a set of two initial
            deposits which will eventually reach 1 million. The longer it takes
            to reach 1,000,000 the better.
          </p>
          <p>
            For example, two deposits are 1 and 5, then the balances on day 1 is
            $1, day 2 is $6. On day 3, the deposit equals the balance of day 1,
            or <code>6 + 1 = 7</code>. This account will hit 1,299,901 on day
            28, so it is not a valid solution. The full history of this account
            is visible below.
          </p>
          <Navigation current={0} className="my-4 text-center" />
          <BalanceSheet result={util.test({ deposit1: 1, deposit2: 5 })} />
          <Navigation current={0} className="my-4 text-center" />
        </div>
      </div>
    </div>
  )
}
