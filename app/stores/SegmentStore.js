'use strict'

import Reflux from 'reflux'
import SegmentActions from '../actions/SegmentActions'
import { requestBuilder, doRequest } from '../utils/requestUtils'
import Firebase from 'firebase'

export default Reflux.createStore({
  listenables: SegmentActions,
  loading: true,
  fireRef: new Firebase('https://stravastats.firebaseio.com/'),
  data: {
    segments: []
  },
  init() {
    this.fireRef.child('segments').on('value', (snapshot) => {
      let segsObj = snapshot.val()
      let segs = []
      for(let id in segsObj) {
        segs.push({ 'id': id, 'customname': segsObj[id] })
      }
      this.listSegments(segs)
    }, (errorObject) => {
      console.log('The read failed: ' + errorObject.code)
    })
  },
  getInitialState() {
    return this.data
  },
  listSegments(segs) {
    segs.map(s => {
      doRequest(
        requestBuilder({ url: `segments/${s.id}` }),
        (seg) => {
          seg.park = s.customname
          this.data.segments.push(seg)
          if(this.data.segments.length == segs.length) {
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
