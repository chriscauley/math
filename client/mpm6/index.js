import React from 'react'
import { sortBy } from 'lodash'
import { Dropdown } from '@unrest/core'
import css from '@unrest/css'

import { connect1, connect2 } from './config'
import BalanceSheet from './BalanceSheet'
import Navigation from './Navigation'

const money = (num) => `${num < 0 ? '-' : ''}$${Math.abs(num)}`

class ResultList extends React.Component {
  state = {}
  render() {
    const { results } = this.props
    const { result } = this.state
    const result_list = sortBy(Object.values(results), 'turns').reverse().map(
      (result) => ({
        children: `${result.turns} turns (${money(result.deposit1)}, ${money(
          result.deposit2,
        )})`,
        onClick: () => this.setState({ result }),
      }),
    )
    return result ? (
      <>
        <Dropdown links={result_list}>Select a different result</Dropdown>
        <BalanceSheet result={result} />
      </>
    ) : (
      <div className={css.list.outer()}>
        {result_list.map((result) => (
          <div
            key={result.children}
            className={css.list.action()}
            onClick={result.onClick}
          >
            {result.children}
          </div>
        ))}
      </div>
    )
  }
}

const ResultSummary = ({ success, turns }) => (
  <div>
    <div>{`${success ? 'Won' : 'Failed'} after ${turns} turns`}</div>
  </div>
)

export const Step1 = connect1((props) => (
  <div className={css.grid.row()}>
    <div className={css.grid.col3()}>
      <div className="border sticky top-0 p-4">
        <Navigation current={1} />
        <connect1.Form />
        {props.config.result && <ResultSummary result={props.config.result} />}
      </div>
    </div>
    <div className={css.grid.col9()}>
      <BalanceSheet result={props.config.result} />
    </div>
  </div>
))

const ProgressBox = ({ progress, stop }) => (
  <div>
    <div>Last checked: deposit1 = ${progress.deposit1}</div>
    <div>{(progress.completed * 100).toFixed(1)} % Complete</div>
    <div>Found {progress.success} results</div>
    {progress.completed < 1 && (
      <button className={css.button()} onClick={stop}>
        Stop
      </button>
    )}
  </div>
)

export const Step2 = connect2((props) => {
  const { progress, actions, results } = props.config
  return (
    <div className={css.grid.row()}>
      <div className={css.grid.col3()}>
        <div className="border sticky top-0 p-4">
          <Navigation current={2} />
          <connect2.Form className={progress && progress.completed < 1 && 'hidden'} />
          {progress && <ProgressBox progress={progress} stop={actions.stop} />}
        </div>
      </div>
      <div className={css.grid.col9()}>
        {results && <ResultList results={results} />}
      </div>
    </div>
  )
})
