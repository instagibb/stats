'use strict'

import React from 'react'
import './Spinner.css'

export default class extends React.Component {
  render() {
    return (<div className="cssload-loader">
      <div className="cssload-inner cssload-one"></div>
      <div className="cssload-inner cssload-two"></div>
      <div className="cssload-inner cssload-three"></div>
    </div>)
  }
}
