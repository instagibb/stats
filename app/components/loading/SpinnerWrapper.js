'use strict'

import React from 'react'
import Spinner from './Spinner'

export default class extends React.Component {
  render() {
    return (
       this.props.showSpinner ? <Spinner /> : <div>{this.props.content ? this.props.content() : this.props.children }</div>
    )
  }
}
