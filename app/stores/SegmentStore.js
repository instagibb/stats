'use strict'

import Reflux from 'reflux'
import SegmentActions from '../actions/SegmentActions'
import { requestBuilder, doRequest } from '../utils/requestUtils'
import { segments } from '../../data/strava_data'

export default Reflux.createStore({
  listenables: SegmentActions,
  loading: true,
  data: {
    segments: []
  },
  init() {
    this.listSegments()
  },
  getInitialState() {
    return this.data
  },
  listSegments() {
    segments.map(s => {
      doRequest(
        requestBuilder({ url: `segments/${s.id}` }),
        (seg) => {
          seg.park = s.park
          this.data.segments.push(seg)
          if(this.data.segments.length == segments.length) {
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
