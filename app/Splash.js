'use strict'

import React from 'react'
import { requestBuilder, doRequest } from './utils/requestUtils'

export default class extends React.Component {
  constructor(props) {
    super(props)
    this.state = { athlete: null }
  }
  componentDidMount() {
    this.doNeedful()
  }
  doNeedful() {
    doRequest(
        requestBuilder({ url: `athletes/2161844` }),
        (athlete) => {
          this.setState({ athlete: athlete })
        }
      )  
  }
  render() {
    const ath = this.state.athlete
    return (
      <div><h1>{ ath ? `${ath.firstname} ${ath.lastname}` : 'Loading...' }</h1></div>
    )
  }
}
