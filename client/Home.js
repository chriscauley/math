import React from 'react'
import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div>
      <div>
        <Link to="/cos/">Taylor Series Visualizer</Link>
      </div>
      <div>
        <Link to="/mpm6/1/">Matt Parkers Math #6</Link>
      </div>
    </div>
  )
}
