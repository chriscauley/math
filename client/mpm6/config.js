import ConfigHook from '@unrest/react-config-hook'
import util from './util'

import schema from './schema'

const { deposit, search, reverse, reverse_search, uiSchema } = schema

export const connect1 = ConfigHook('mpm6-1', {
  schema: deposit,
  uiSchema,
  actions: {
    onSave: (store, { formData }) => {
      formData && store.actions.save({ result: util.test(formData) })
    },
  },
})

export const connect2 = ConfigHook('mpm6-2', {
  schema: search,
  uiSchema,
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

export const connect3 = ConfigHook('mpm6-3', {
  schema: reverse,
  uiSchema,
  actions: {},
})
