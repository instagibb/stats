'use strict'

import Reflux from 'reflux'
import EffortActions from '../actions/EffortActions'
import SegmentStore from './SegmentStore'
import { requestBuilder, doRequest } from '../utils/requestUtils'
import moment from 'moment'
import _ from 'lodash'

export default Reflux.createStore({
  listenables: EffortActions,
  data: {
    segments: []
  },
  init() {
    this.listenTo(SegmentStore, this.otherStoreDataChanged)
  },
  otherStoreDataChanged() {
    this.getAllEffortsForSegments()
  },
  getInitialState() {
    return this.data
  },
  getAllEffortsForSegments() {
    const segs = SegmentStore.getSegments()
    this.data.segments = segs
    segs.map(s => {
      this.getAllTheThings(s.id)
    })
  },
  getEmBoys(total, seg, s, e, p) {
    doRequest(requestBuilder({ url: `segments/${seg}/all_efforts?per_page=200&start_date_local=${s}&end_date_local=${e}&page=${p}` }),
    (efforts) => {
      console.log(`EFFORTS: ${efforts.length}`)
      total = total.concat(efforts)
      console.log(`TOTAL: ${total.length}`)
      if(efforts.length == 200) {
        console.log('getting more efforts')
        this.getEmBoys(total, s, e, ++p)
      }
      else {
        _.find(this.data.segments, { id: seg }).effortsmonth = total
        this.trigger(this.data)
      }
    })
  },
  getAllTheThings(seg) {
    // Make array
    const s = moment().startOf('month').toISOString()
    const e = moment().endOf('month').toISOString()
    // Keep executing till size != 200
    this.getEmBoys([], seg, s, e, 1)
  }
})
