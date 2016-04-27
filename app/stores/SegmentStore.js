'use strict'

import Reflux from 'reflux'
import SegmentActions from '../actions/SegmentActions'
import AuthStore from './AuthStore'
import { requestBuilder, doRequest } from '../utils/requestUtils'
import { fireRef } from '../utils/firebaseUtils'
import _ from 'lodash'

const segPath = 'devsegs'

export default Reflux.createStore({
  listenables: SegmentActions,
  loading: true,
  data: {
    segments: []
  },
  init() {
    this.listenTo(AuthStore, this.authStoreDataChanged)
  },
  authStoreDataChanged() {
    if(_.isEmpty(this.data.segments)) {
      console.log(`SETUP SEG STORE`)
      const segRef = fireRef.child(segPath)
      segRef.once('value', (snapshot) => {
        console.log(`GETTING INITIAL DATA`)
        let segsObj = snapshot.val()
        let segs = []
        for(let id in segsObj) {
          segs.push({ 'id': id, 'customname': segsObj[id] })
        }
        console.log(segs)
        this.listSegments(segs)
      }, (errorObject) => {
        console.log('The read failed: ' + errorObject.code)
      })

      segRef.on('child_added', (snapshot) => {
        console.log(`SEGMENT ADDED`)
        
      })

      segRef.on('child_changed', (snapshot) => {
        console.log(`SEGMENT EDITED`)

      })

      segRef.on('child_removed', (snapshot) => {
        console.log(`SEGMENT REMOVED`)
      })
    }
  },
  getInitialState() {
    return this.data
  },
  addSegment(segment) {
    console.log(`ADDING SEGMENT: ${segment.id}`)
    fireRef.child(segPath).child(segment.id).set(segment.customname)
  },
  editSegment(segment) {
    console.log(`EDITING SEGMENT: ${segment}`)
    fireRef.child(segPath).child(segment.id).set(segment.customname)
  },
  deleteSegment(segment) {
    console.log(`DELETING SEGMENT: ${segment.id}`)
    fireRef.child(segPath).child(segment.id).set(null)
  },
  listSegments(segs) {
    console.log(`LISTING SEGMENTS`)
    this.data.segments = []
    segs.map(s => {
      doRequest(
        requestBuilder({ url: `segments/${s.id}` }),
        (seg) => {
          seg.customname = s.customname
          this.data.segments.push(seg)
          if(this.data.segments.length == segs.length) {
            this.data.segments = _.sortBy(this.data.segments, [ 'id' ])
            this.trigger(this.data)
          }
        }
      )
    })
  },
  getSegmentFromStrava(s) {
    doRequest(
      requestBuilder({ url: `segments/${s.id}` }),
      (seg) => {
        seg.customname = seg.customname
        this.data.segments.push(seg)
        this.data.segments = _.sortBy(this.data.segments, [ 'id' ])
        this.trigger(this.data)
      }
    )
  },
  getSegments() {
    return this.data.segments
  }
})
