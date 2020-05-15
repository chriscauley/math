import React from 'react'
import { Link } from 'react-router-dom'
import css from '@unrest/css'

export default function Navigation({ current }) {
  const max = 4
  return (
    <div className="flex justify-between pb-4 mb-4">
      {current !== 0 && (
        <Link to={`/mpm6/${current - 1}/`} className={css.link()}>
          Last Step
        </Link>
      )}
      {current < max && (
        <Link to={`/mpm6/${current + 1}/`} className={css.link()}>
          Next Step
        </Link>
      )}
    </div>
  )
}
