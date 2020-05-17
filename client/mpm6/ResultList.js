import React from 'react'
import { sortBy } from 'lodash'
import { Dropdown } from '@unrest/core'
import css from '@unrest/css'

import BalanceSheet from './BalanceSheet'
import money from './money'

export default class ResultList extends React.Component {
  state = {}
  render() {
    const select = result => () => this.setState({result})
    const { results=[] } = this.props
    const { result } = this.state
    const result_list = sortBy(Object.values(results), 'turns')
      .reverse()
      .map((result) => ({
        children: `${result.turns} turns (${money(result.deposit1)}, ${money(
          result.deposit2,
        )})`,
        onClick: select(result),
      }))
    if (!result_list.length) {
      return "Choose two values to search between"
    }

    return result ? (
      <>
        <div className={css.link('mb-4')} onClick={select(null)}>{"<< Result List"}</div>
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
