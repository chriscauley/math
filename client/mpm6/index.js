import React from 'react'
import { withConfig } from './config'

const css = {
  list: 'border-b',
  row: 'p-4 border border-b-0 flex justify-between',
  day: 'text-gray-400 pr-16',
}

const BalanceSheet = ({ result }) => {
  if (!result) {
    return 'Pick two deposite amounts to start'
  }
  const balances = result.balances
  return (
    <>
      <div className="w-1/4 p-2">
        <div className="sticky top-0">Result...</div>
      </div>
      <div className="w-2/4 p-2">
        <div className={css.list}>
          {balances.map((balance, i) => (
            <div key={balance} className={css.row}>
              <span className={css.day}>Day {i + 1}</span>${balance}
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default withConfig((props) => {
  const { result } = props.config
  return (
    <div className="flex flex-wrap -mx2">
      <div className="w-1/4 p-2">
        <withConfig.Form className="border sticky top-0 p-4" />
      </div>
      <BalanceSheet result={result} />
    </div>
  )
})
