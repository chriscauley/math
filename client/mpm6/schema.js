const deposit = {
  type: 'object',
  properties: {
    deposit1: { type: 'integer' },
    deposit2: { type: 'integer' },
  },
  required: ['deposit1', 'deposit2'],
}

const search = {
  type: 'object',
  properties: {
    lower_bound: { type: 'integer' },
    upper_bound: { type: 'integer' },
  },
  required: ['upper_bound', 'lower_bound'],
}

const reverse = {
  type: 'object',
  properties: {
    penultimate: { type: 'integer' },
  },
  required: ['penultimate'],
}

const reverse_search = {
  type: 'object',
  properties: {
    lower_bound: { type: 'integer' },
    upper_bound: { type: 'integer' },
  },
  required: ['upper_bound', 'lower_bound'],
}

export default {
  deposit,
  search,
  reverse,
  reverse_search,
}
