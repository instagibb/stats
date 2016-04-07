'use strict'

import React from 'react'
import { Grid, Navbar } from 'react-bootstrap'
import Segments from '../pages/Segments'

export default class extends React.Component {
  render() {
    return (
      <div>
        <Navbar>
          <Navbar.Header>
            <Navbar.Brand>
              Poor mans trail counter (powered by Strava)
            </Navbar.Brand>    
          </Navbar.Header>
        </Navbar>
        <Grid>
          <Segments />
        </Grid>
      </div>
    )
  }
}
