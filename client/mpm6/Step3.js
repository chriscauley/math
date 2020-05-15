import React from 'react'
import css from '@unrest/css'
import ConfigHook from '@unrest/react-config-hook'
import BalanceSheet from './BalanceSheet'
import Navigation from './Navigation'
import util from './util'

const schema = {
  type: 'object',
  properties: {
    penultimate: {
      title: 'Penultimate Balance',
      type: 'integer',
    },
  },
  required: ['penultimate'],
}

const actions = {
  onSave(store, { formData }) {
    formData && store.actions.save({ result: util.reverse(formData) })
  },
}

const connect = ConfigHook('mpm6-3', { schema, actions })

export default connect((props) => {
  return (
    <div className={css.grid.row()}>
      <div className={css.grid.col3()}>
        <Navigation current={3} />
        <div className="border sticky top-0 p-4">
          <connect.Form />
        </div>
      </div>
      <div className={css.grid.col9()}>
        <BalanceSheet
          result={props.config.result}
          empty={
            'Enter the penultimate balance (balance on the second to last day) to start.'
          }
        />
      </div>
    </div>
  )
})
