'use strict'

import Reflux from 'reflux'
import AuthActions from '../actions/AuthActions'
import { fireRef } from '../utils/firebaseUtils'
import _ from 'lodash'
import appConstants from '../constants/appConstants'
import crypto from 'crypto'

const data = {
  uid: null,
  name: null,
  loggedIn: false
}

export default Reflux.createStore({
  listenables: AuthActions,
  init() {
    fireRef.onAuth((authData) => {
      if (authData) {
        AuthActions.loggedIn(authData)
      } else {
        AuthActions.loggedOut()
      }
    })
  },
  getInitialState() {
    return data
  },
  logIn() {
    console.log(`LOGGING IN`)
    fireRef.authWithOAuthPopup('facebook', (error, authData) => {
      if (error) {
        console.log('Login Failed!', error)
      }
    })
  },
  loggedIn(authData) {
    console.log(`LOGGED IN AS: ${authData.facebook.displayName}`)
    data.uid = authData.uid
    data.loggedIn = true
    data.name = authData.facebook.displayName

    // Store uid and displayName if new
    const userRef = fireRef.child('users').child(data.uid)
    userRef.child('displayName').once('value', (snapshot) => {
      if (!snapshot.exists()) {
        snapshot.ref().set(data.name)
      }
      this.trigger(data)
    })
  },
  logOut() {
    fireRef.unauth()
  },
  loggedOut() {
    data.name = null
    data.uid = null
    data.loggedIn = false
    this.trigger(data)
  },
  getDisplayName() {
    return data.name
  },
  getUid() {
    return data.uid
  },
  isLoggedIn() {
    return data.loggedIn
  },
  isAdmin() {
    return this.isLoggedIn() && _.includes(appConstants.admins, crypto.createHash('sha256').update(this.getUid()).digest('hex'))
  }
})
