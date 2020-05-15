import { sortBy } from 'lodash'
import React from 'react'
import { Link } from 'react-router-dom'
import { connect1, connect2 } from './config'
import { Dropdown } from '@unrest/core'
import css from '@unrest/css'

const money = (num) => `${num < 0 ? '-' : ''}$${Math.abs(num)}`

Object.assign(
  css,
  css.CSS({
    row: 'flex flex-wrap -mx2',
    col3: 'w-1/4 p-2',
    col6: 'w-1/2 p-2',
    col9: 'w-3/4 p-2',
    col4: 'w-1/3 p-2',
    col8: 'w-2/3 p-2',
  }),
)

const Navigation = ({ current }) => {
  const max = 4
  return (
    <div className="flex justify-between pb-4 mb-4">
      {current !== 0 && (
        <Link to={`/mpm6/${current - 1}/`} className={css.link()}>
          Last Step
        </Link>
      )}
      {current < max && (
        <Link to={`/mpm6/${current + 1}/`} className={css.link()}>
          Next Step
        </Link>
      )}
    </div>
  )
}

const BalanceSheet = ({ result }) => {
  if (!result) {
    return 'Pick two deposite amounts to start'
  }
  let last = 0
  const rows = result.balances.map((balance, i) => {
    const diff = 1e6 - Math.abs(balance)
    const row = [`Day ${i + 1}`, money(balance - last), money(balance), diff]
    last = balance
    return row
  })

  return (
    <table className={`balance-sheet ${result.success ? 'success' : 'fail'}`}>
      <thead>
        <tr>
          <td></td>
          <td>Deposit</td>
          <td>Balance</td>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r[0]}>
            <td>{r[0]}</td>
            <td>{r[1]}</td>
            <td>{r[2]}</td>
            <td>{r[3]}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

class ResultList extends React.Component {
  state = {}
  render() {
    const { results } = this.props
    const { result } = this.state
    const result_list = sortBy(Object.values(results), 'datetime').map(
      (result) => ({
        children: `${result.turns} turns (${money(result.deposit1)}, ${money(result.deposit2)})`,
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
  <div className={css.row()}>
    <div className={css.col3()}>
      <div className="border sticky top-0 p-4">
        <Navigation current={1} />
        <connect1.Form />
        {props.config.result && <ResultSummary result={props.config.result} />}
      </div>
    </div>
    <div className={css.col9()}>
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
    <div className={css.row()}>
      <div className={css.col3()}>
        <div className="border sticky top-0 p-4">
          <Navigation current={2} />
          <connect2.Form className={progress && 'hidden'} />
          {progress && <ProgressBox progress={progress} stop={actions.stop} />}
        </div>
      </div>
      <div className={css.col9()}>
        {results && <ResultList results={results} />}
      </div>
    </div>
  )
})
