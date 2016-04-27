'use strict'

import Reflux from 'reflux'
import EffortActions from '../actions/EffortActions'
import SegmentStore from './SegmentStore'
import { requestBuilder, doRequest } from '../utils/requestUtils'
import moment from 'moment'
import _ from 'lodash'

const data = {
  segments: [],
  currentYear: null
}

export default Reflux.createStore({
  listenables: EffortActions,
  loading: false, 
  init() {
    this.listenTo(SegmentStore, this.segmentStoreDataChanged)
  },
  segmentStoreDataChanged() {
    console.log('EFFORT STORE - SEGMENTS CHANGED')
    data.segments = SegmentStore.getSegments()
    this.trigger(data)
    this.getAllEffortsForSegments()
  },
  getInitialState() {
    return data
  },
  getAllEffortsForSegments(y) {
    const segs = SegmentStore.getSegments()
    
    // Default start dates
    let start = moment.utc([ y ]).startOf('year').toISOString()
    let end = moment.utc([ y ]).endOf('year').toISOString()
    if(!y) {
      start = moment.utc().startOf('year').toISOString()
      end = moment.utc().endOf('month').toISOString()
    } 

    data.segments = segs
    const year = moment.utc(start).year()
    if(_.isEmpty(data.segments[0][year])) {
      console.log(`GETTING EFFORT DATA FOR: ${year}`)
      segs.map(s => {
        this.getAllTheEfforts(year, [], s.id, start, end, 1)
      }) 
    } else {
      console.log(`ALREADY GOT EFFORT DATA FOR: ${year}`)
      data.segments = segs
      this.trigger(data)
    }
  },
  getAllTheEfforts(year, total, seg, s, e, p) {
    doRequest(requestBuilder({ url: `segments/${seg}/all_efforts?per_page=200&start_date_local=${s}&end_date_local=${e}&page=${p}` }),
    (efforts) => {
      total = total.concat(efforts)
      if(efforts.length == 200) {
        this.getAllTheEfforts(year, total, seg, s, e, ++p)
      }
      else {
        _.find(data.segments, { id: seg })[year] = total
        data.segments = _.sortBy(data.segments, [ 'id' ])
        this.trigger(data)
      }
    })
  },
  hasNew(segs) {

  },
  setLoading(load) {
    this.loading = load
  },
  isLoading() {
    return this.loading
  }
})
