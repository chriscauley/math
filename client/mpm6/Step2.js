import React from 'react'
import { Dropdown } from '@unrest/core'
import css from '@unrest/css'
import ConfigHook from '@unrest/react-config-hook'

import ResultList from './ResultList'
import Navigation from './Navigation'
import ProgressBox from './ProgressBox'
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

const ProgressInner = ({progress}) => (
  <>
    <div>Last checked: deposit1 = {money(progress.deposit1)}</div>
    <div>Found {progress.success} results</div>
  </>
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
          {progress && (
            <ProgressBox
              inner={<ProgressInner progress={progress}/>}
              progress={progress}
              stop={actions.stop}
            />
          )}
        </div>
      </div>
      <div className={css.grid.col9()}>
        {results && <ResultList results={results} />}
      </div>
    </div>
  )
})
