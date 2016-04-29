'use strict'

import React from 'react'
import Nav from './layout/Nav'

export default class extends React.Component {
  render() {
    return (
      <div>
        <Nav />
        <div>
          <div className="footer-content">{'Created by Andrew Gibb · 2016 · '}<a href="https://github.com/instagibb/stats">GitHub</a></div>
        </div>
      </div>
    )
  }
}
