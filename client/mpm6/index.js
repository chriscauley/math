import { sortBy } from 'lodash'
import React from 'react'
import { Link } from 'react-router-dom'
import { connect1, connect2 } from './config'
import { Dropdown } from '@unrest/core'
import css from '@unrest/css'

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

css.sheet = css.CSS({
  list: 'border-b',
  row: 'p-4 border border-b-0 flex flex-wrap justify-between',
  day: 'text-gray-400 w-16',
})

const BalanceSheet = ({ result }) => {
  const money = (num) => `${num < 0 ? '-' : '+'} $${Math.abs(num)}`
  if (!result) {
    return 'Pick two deposite amounts to start'
  }
  let last = 0
  let last_diff = Infinity
  const rows = result.balances.map((balance, i) => {
    const diff = 1e6 - Math.abs(balance)
    const row = {
      day: `Day ${i + 1}`,
      deposit: balance - last,
      balance,
      diff,
      divergent: Math.abs(last_diff) < Math.abs(diff),
    }
    last = balance
    last_diff = diff
    return row
  })
  return (
    <>
      <div className={css.col3()}>
        <div className="sticky top-0 pt-4">Result...</div>
      </div>
      <div className={css.col6()}>
        <div className={css.sheet.list()}>
          <div className={css.sheet.row()}>
            <span className={css.sheet.day()}></span>
            <span className="px-2">Deposit</span>
            <span>Balance</span>
            <span>Difference</span>
          </div>
          {rows.map((r) => (
            <div
              key={r.day}
              className={css.sheet.row({ 'bg-red-100': r.divergent })}
            >
              <span className={css.sheet.day()}>{r.day}</span>
              <span className="px-2">{r.deposit}</span>
              <span>{money(r.balance)}</span>
              <span>{money(r.diff)}</span>
              <span>{Math.abs(r.diff || 0)}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

class ResultList extends React.Component {
  state = {}
  render() {
    const { results } = this.props
    const { result } = this.state
    const result_list = sortBy(Object.values(results), 'datetime').map(
      (result) => ({
        children: result.key,
        onClick: () => this.setState({ result }),
      }),
    )
    return result ? (
      <>
        <Dropdown links={result_list}>
          Select a different result
        </Dropdown>
        <BalanceSheet result={result} />
      </>
    ) : (
      <div className={css.list.outer()}>
        {result_list.map( result => (
          <div key={result.children} className={css.list.action()} onClick={result.onClick}>{result.children}</div>
        ))}
      </div>
    )
  }
}

const SearchMatrix = (props) => {
  const { results = {}, progress, actions } = props
  return (
    <div className={css.col9()}>
      <div className={css.row()}>
        {progress && (
          <div className={css.col6()}>
            <div>Last checked: deposit1 = ${progress.deposit1}</div>
            <div>{(progress.completed * 100).toFixed(1)} % Complete</div>
            <div>Found {progress.success} results</div>
            {progress.completed < 1 && (
              <button className={css.button()} onClick={actions.stop}>
                Stop
              </button>
            )}
          </div>
        )}
        <div className={css.col6()}>
          <ResultList results={results} />
        </div>
      </div>
    </div>
  )
}

const BaseStep = (props) => {
  const { Form } = props.config
  return (
    <div className={css.row()}>
      <div className={css.col3()}>
        <Form
          className="border sticky top-0 p-4"
          after={<Link to={`/mpm6/${props.step + 1}/`}>Next Step</Link>}
        />
      </div>
      <props.InnerComponent {...props.config} />
    </div>
  )
}

export const Step1 = connect1((props) => (
  <BaseStep InnerComponent={BalanceSheet} {...props} step={1} />
))
export const Step2 = connect2((props) => (
  <BaseStep InnerComponent={SearchMatrix} {...props} step={2} />
))
