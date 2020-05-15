import React from 'react'
import money from './money'

export default function BalanceSheet({ result, empty }) {
  if (!result) {
    return <div className="p-4">{empty}</div>
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
