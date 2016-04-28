'use strict'

import React from 'react'
import Reflux from 'reflux'
import { Grid, Nav, NavItem, Navbar } from 'react-bootstrap'
import AuthActions from '../actions/AuthActions'
import AuthStore from '../stores/AuthStore'
import Segments from '../pages/Segments'

export default React.createClass({
  mixins: [
    Reflux.connect(AuthStore, 'authdata')
  ],
  toggleAuth() {
    AuthStore.isLoggedIn() ? AuthActions.logOut() : AuthActions.logIn()
  },
  render() {
    let authText
    let authLink
    if(!AuthStore.isLoading() && AuthStore.isLoggedIn()) {
      authText =  (<Navbar.Text>
        {`${AuthStore.getDisplayName()}`}
      </Navbar.Text>)
      authLink = (<Nav pullRight>
        <NavItem eventKey={1} onClick={this.toggleAuth}>{AuthStore.isLoggedIn() ? 'Log out' : 'Log in'}</NavItem>
      </Nav>)
    }

    return (
      <div>
        <Navbar>
          <Navbar.Header>
            <Navbar.Brand>
              Strava Stats
            </Navbar.Brand>    
          </Navbar.Header>
          {authText}
          {authLink}
        </Navbar>
        <Grid>
          <Segments />
        </Grid>
      </div>
    )
  }
})
