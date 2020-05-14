import ConfigHook from '@unrest/react-config-hook'
import util from './util'

import { schema } from './schema'

const actions = {
  onSave(store, formData) {
    store.setState({ result: util.test(formData) })
  },
}

export const withConfig = ConfigHook('mpm6', { schema, uiSchema: {}, actions })
