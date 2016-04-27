'use strict'

import Reflux from 'reflux'
import SegmentActions from '../actions/SegmentActions'
import AuthStore from './AuthStore'
import { requestBuilder, doRequest } from '../utils/requestUtils'
import { fireRef } from '../utils/firebaseUtils'
import _ from 'lodash'

const segPath = 'devsegs'

const data = {
  segments: []
}

export default Reflux.createStore({
  listenables: SegmentActions,
  loading: true,

  init() {
    this.listenTo(AuthStore, this.authStoreDataChanged)
  },
  authStoreDataChanged() {
    if(_.isEmpty(data.segments)) {
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
    }
  },
  getInitialState() {
    return data
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
    data.segments = []
    segs.map(s => {
      doRequest(
        requestBuilder({ url: `segments/${s.id}` }),
        (seg) => {
          seg.customname = s.customname
          data.segments.push(seg)
          if(data.segments.length == segs.length) {
            data.segments = _.sortBy(data.segments, [ 'id' ])
            this.trigger(data)

            this.setupEvents()
          }
        }
      )
    })
  },
  getSegmentFromStrava(s) {
    doRequest(
      requestBuilder({ url: `segments/${s.id}` }),
      (seg) => {
        seg.customname = s.customname
        data.segments.push(seg)
        data.segments = _.sortBy(data.segments, [ 'id' ])
        this.trigger(data)
      }
    )
  },
  setupEvents() {
    const segRef = fireRef.child(segPath)
    segRef.on('child_added', (snapshot) => {
      const id = parseInt(snapshot.key())
      console.log(`SEGMENT ADDED EVENT: ${id}`)
      if(_.isUndefined(data.segments.find((seg) => seg.id === id))) {
        this.getSegmentFromStrava({ id: snapshot.key(), customname: snapshot.val() })
      } 
    })

    segRef.on('child_changed', (snapshot) => {
      const id = parseInt(snapshot.key())
      console.log(`SEGMENT EDITED EVENT: ${id}`)
      _.find(data.segments, { id: id }).customname = snapshot.val()
      this.trigger(data)
    })

    segRef.on('child_removed', (snapshot) => {
      const id = parseInt(snapshot.key())
      console.log(`SEGMENT REMOVED EVENT: ${id}`)
      data.segments = data.segments.filter((seg) => seg.id !== id)
      this.trigger(data)
    })
  },
  getSegments() {
    return data.segments
  }
})
