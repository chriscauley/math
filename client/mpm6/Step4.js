import React from 'react'
import css from '@unrest/css'
import ConfigHook from '@unrest/react-config-hook'
import ResultList from './ResultList'
import Navigation from './Navigation'
import util from './util'
import ProgressBox from './ProgressBox'

const schema = {
  type: 'object',
  properties: {
    lower_bound: { type: 'integer' },
    upper_bound: { type: 'integer' },
  },
  required: ['upper_bound', 'lower_bound'],
}

// copied from step 2, not sure if should be generalized
export const connect = ConfigHook('mpm6-4', {
  schema,
  actions: {
    stop: (store) => {
      clearTimeout(store.state.progress.timeout)
      store.setState({ progress: null })
    },
    // this is the only line changed from step 2 so far
    onSave: (store, { formData }) =>
      formData && util.reverseSearch(formData, store),
    setProgress: (store, new_state) => {
      // remove progress as it doesn't belong in final (local storage) state
      const progress = new_state.progress
      delete new_state.progress
      store.setState({ progress })

      const { results = {} } = store.state
      const result = new_state.best_result
      results[result.key] = result
      new_state.results = results
      store.actions.save(new_state)
    },
  },
})

export default connect((props) => {
  const { progress, actions, results } = props.config
  return (
    <div className={css.grid.row()}>
      <div className={css.grid.col3()}>
        <Navigation current={3} />
        <div className="border sticky top-0 p-4">
          <connect.Form />
          {progress && (
            <ProgressBox
              inner={`Last checked: ${progress.current}`}
              progress={progress}
              stop={actions.stop}
            />
          )}
        </div>
      </div>
      <div className={css.grid.col9()}>
        <ResultList
          results={results}
          empty={
            'Enter the penultimate balance (balance on the second to last day) to start.'
          }
        />
      </div>
    </div>
  )
})
