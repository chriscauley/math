import React from 'react'
import css from '@unrest/css'

export default function({ progress, stop, inner }) {
  return (
    <div>
      {inner}
      <div>{(progress.completed * 100).toFixed(1)} % Complete</div>
      <div>Found {progress.success} results</div>
      {progress.completed < 1 && (
        <button className={css.button()} onClick={stop}>
          Stop
        </button>
      )}
    </div>
  )
}