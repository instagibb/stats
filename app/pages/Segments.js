'use strict'

import React from 'react'
import Reflux from 'reflux'
import EffortStore from '../stores/EffortStore'
import SegmentList from '../components/SegmentList'
import _ from 'lodash'

export default React.createClass({
  mixins: [ 
    Reflux.connect(EffortStore, 'segmentdata') 
  ],
  getInitialState() {
    return {}
  },
  render() {
    const segs = this.state.segmentdata.segments

    return (
      <div>
        {  !_.isEmpty(segs) ? <SegmentList segments={segs} /> : 'Loading...' }
      </div>
    )
  }
})
