'use strict'

import Reflux from 'reflux'
import EffortActions from '../actions/EffortActions'
import SegmentStore from './SegmentStore'
import { requestBuilder, doRequest } from '../utils/requestUtils'
import moment from 'moment'
import _ from 'lodash'

export default Reflux.createStore({
  listenables: EffortActions,
  loading: false,
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
  getAllEffortsForSegments(s, e) {
    const segs = SegmentStore.getSegments()
    let start = s
    let end = e
    if(!s && !e) {
      start = moment.utc().startOf('month').toISOString()
      end = moment.utc().endOf('month').toISOString()
    } else {
      segs.map(s => { 
        _.unset(s, 'effortsmonth') 
      })
    }
    this.data.segments = segs
    segs.map(s => {
      this.getAllTheEfforts(s.id, start, end)
    })
  },
  getEmBoys(total, seg, s, e, p) {
    doRequest(requestBuilder({ url: `segments/${seg}/all_efforts?per_page=200&start_date_local=${s}&end_date_local=${e}&page=${p}` }),
    (efforts) => {
      total = total.concat(efforts)
      if(efforts.length == 200) {
        this.getEmBoys(total, seg, s, e, ++p)
      }
      else {
        _.find(this.data.segments, { id: seg }).effortsmonth = total
        this.data.segments = _.sortBy(this.data.segments, [ 'id' ])
        this.trigger(this.data)
      }
    })
  },
  getAllTheEfforts(seg, start, end) {
    this.getEmBoys([], seg, start, end, 1)
  },
  setLoading(load) {
    this.loading = load
  },
  isLoading() {
    return this.loading
  }
})
