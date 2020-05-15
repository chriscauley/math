import React from 'react'
import css from '@unrest/css'

import { connect1 } from './config'
import BalanceSheet from './BalanceSheet'
import Navigation from './Navigation'

const ResultSummary = ({ success, turns }) => (
  <div>
    <div>{`${success ? 'Won' : 'Failed'} after ${turns} turns`}</div>
  </div>
)

export default connect1(function Step1(props) {
  return (
    <div className={css.grid.row()}>
      <div className={css.grid.col3()}>
        <div className="border sticky top-0 p-4">
          <Navigation current={1} />
          <connect1.Form />
          {props.config.result && (
            <ResultSummary result={props.config.result} />
          )}
        </div>
      </div>
      <div className={css.grid.col9()}>
        <BalanceSheet
          result={props.config.result}
          empty={'Pick two deposite amounts.'}
        />
      </div>
    </div>
  )
})
