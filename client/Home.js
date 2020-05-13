import React from 'react'
import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="flex">
      <Link to="/cos/">Taylor Series Visualizer</Link>
    </div>
  )
}
