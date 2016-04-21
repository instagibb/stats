'use strict'

import Firebase from 'firebase'
import appConstants from '../constants/appConstants'

export const fireRef = new Firebase(appConstants.firebase)
