'use strict'

import Reflux from 'reflux'
import SegmentActions from '../actions/SegmentActions'
import { requestBuilder, doRequest } from '../utils/requestUtils'
import { fireRef } from '../utils/firebaseUtils'
import _ from 'lodash'

export default Reflux.createStore({
  listenables: SegmentActions,
  loading: true,
  data: {
    segments: []
  },
  init() {
    fireRef.child('segments').on('value', (snapshot) => {
      let segsObj = snapshot.val()
      let segs = []
      for(let id in segsObj) {
        segs.push({ 'id': id, 'customname': segsObj[id] })
      }
      this.listSegments([ segs[11] ])
    }, (errorObject) => {
      console.log('The read failed: ' + errorObject.code)
    })
  },
  getInitialState() {
    return this.data
  },
  addSegment(segment) {
    console.log(`ADDING SEGMENT: ${segment.id}`)
  },
  editSegment(segment) {
    console.log(`EDITING SEGMENT: ${segment.id}`)
  },
  deleteSegment(segment) {
    console.log(`DELETING SEGMENT: ${segment.id}`)
  },
  listSegments(segs) {
    segs.map(s => {
      doRequest(
        requestBuilder({ url: `segments/${s.id}` }),
        (seg) => {
          seg.park = s.customname
          this.data.segments.push(seg)
          if(this.data.segments.length == segs.length) {
            this.data.segments = _.sortBy(this.data.segments, [ 'id' ])
            this.trigger(this.data)
          }
        }
      )
    })
  },
  getSegments() {
    return this.data.segments
  }
})
