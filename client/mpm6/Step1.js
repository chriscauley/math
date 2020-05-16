import React from 'react'
import css from '@unrest/css'
import ConfigHook from '@unrest/react-config-hook'

import BalanceSheet from './BalanceSheet'
import Navigation from './Navigation'
import util from './util'

const schema = {
  type: 'object',
  properties: {
    deposit1: { type: 'integer' },
    deposit2: { type: 'integer' },
  },
  required: ['deposit1', 'deposit2'],
}

export const connect = ConfigHook('mpm6-1', {
  schema,
  actions: {
    onSave: (store, { formData }) => {
      formData && store.actions.save({ result: util.test(formData) })
    },
  },
})

const ResultSummary = ({ success, turns }) => (
  <div>
    <div>{`${success ? 'Won' : 'Failed'} after ${turns} turns`}</div>
  </div>
)

export default connect(function Step1(props) {
  return (
    <div className={css.grid.row()}>
      <div className={css.grid.col3()}>
        <div className="border sticky top-0 p-4">
          <Navigation current={1} />
          <connect.Form />
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
