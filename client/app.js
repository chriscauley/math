import React from 'react'
import ReactDOM from 'react-dom'
import { HashRouter, Route } from 'react-router-dom'

import Home from './Home'
import Nav from './Nav'
import Cos from './cos'
import { Step1, Step2 } from './mpm6'

const App = () => {
  return (
    <>
      <HashRouter>
        <Nav />
        <div className="app-content">
          <Route exact path="/" component={Home} />
          <Route exact path="/cos/" component={Cos} />
          <Route path="/mpm6/1/" component={Step1} />
          <Route path="/mpm6/2/" component={Step2} />
        </div>
      </HashRouter>
    </>
  )
}

const domContainer = document.querySelector('#react-app')
ReactDOM.render(<App />, domContainer)
