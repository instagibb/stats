'use strict'

import React from 'react'
import stravaV3 from 'strava-v3' 

export default class extends React.Component {
  doNeedful() {
    stravaV3.athlete.get({ }, (err,payload) => {
      if(!err) {
        console.log(payload)
      }
      else {
        console.log(err)
      }
    })
  }
  render() {
    const blah = this.doNeedful()
    return (
      <div>{blah}</div>
    )
  }
}
