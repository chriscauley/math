import React from 'react'
import ReactDOM from 'react-dom'
import { HashRouter, Route } from 'react-router-dom'

import Home from './Home'
import Nav from './Nav'
import Cos from './cos'
import MPM6 from './mpm6'

const App = () => {
  return (
    <>
      <HashRouter>
        <Nav />
        <div className="app-content">
          <Route exact path="/" component={Home} />
          <Route exact path="/cos/" component={Cos} />
          <Route exact path="/mpm6/" component={MPM6} />
        </div>
      </HashRouter>
    </>
  )
}

const domContainer = document.querySelector('#react-app')
ReactDOM.render(<App />, domContainer)
