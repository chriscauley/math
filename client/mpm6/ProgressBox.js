import React from 'react'
import css from '@unrest/css'

export default function ProgressBar({ progress, stop, inner }) {
  const { start, now, completed } = progress
  const elapsed = (now - start) / 1000
  const estimated = elapsed / completed
  return (
    <div>
      {inner}
      <div>{(completed * 100).toFixed(1)} % Complete</div>
      {completed < 1 && (
        <>
          <div>
            {elapsed}s / {Math.round(estimated)}s
          </div>
          <button className={css.button()} onClick={stop}>
            Stop
          </button>
        </>
      )}
    </div>
  )
}
