import React from 'react'
import { sortBy } from 'lodash'
import { Dropdown } from '@unrest/core'
import css from '@unrest/css'
import ConfigHook from '@unrest/react-config-hook'

import BalanceSheet from './BalanceSheet'
import Navigation from './Navigation'
import money from './money'
import util from './util'

const schema = {
  type: 'object',
  properties: {
    lower_bound: { type: 'integer' },
    upper_bound: { type: 'integer' },
  },
  required: ['upper_bound', 'lower_bound'],
}

export const connect = ConfigHook('mpm6-2', {
  schema,
  actions: {
    stop: (store) => {
      clearTimeout(store.state.progress.timeout)
      store.setState({ progress: null })
    },
    onSave: (store, { formData }) => formData && util.search(formData, store),
    setProgress: (store, progress) => store.setState({ progress }),
    saveResult: (store, result) => {
      const { results = {} } = store.state
      if (result.success && !results[result.key]) {
        results[result.key] = result
        store.actions.save({ results })
      }
    },
  },
})

class ResultList extends React.Component {
  state = {}
  render() {
    const { results } = this.props
    const { result } = this.state
    const result_list = sortBy(Object.values(results), 'turns')
      .reverse()
      .map((result) => ({
        children: `${result.turns} turns (${money(result.deposit1)}, ${money(
          result.deposit2,
        )})`,
        onClick: () => this.setState({ result }),
      }))
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

export default connect((props) => {
  const { progress, actions, results } = props.config
  return (
    <div className={css.grid.row()}>
      <div className={css.grid.col3()}>
        <div className="border sticky top-0 p-4">
          <Navigation current={2} />
          <connect.Form
            className={progress && progress.completed < 1 && 'hidden'}
          />
          {progress && <ProgressBox progress={progress} stop={actions.stop} />}
        </div>
      </div>
      <div className={css.grid.col9()}>
        {results && <ResultList results={results} />}
      </div>
    </div>
  )
})
