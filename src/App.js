import React, { Component } from 'react'
import NameCard from './views/landing'
import PreLanding from './views/prelanding'

class App extends Component {
  constructor () {
    super()
    this.state = {}
  }

  render () {
    return (
      <div className='AppContainer'>
        <PreLanding />
      </div>
    )
  }
}
export default App
