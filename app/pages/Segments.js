'use strict'

import React from 'react'
import Reflux from 'reflux'
import EffortActions from '../actions/EffortActions'
import EffortStore from '../stores/EffortStore'
import SegmentList from '../components/SegmentList'
import SpinnerWrapper from '../components/loading/SpinnerWrapper'
import Select from 'react-select'
import '../../node_modules/react-select/dist/react-select.css'

import { ButtonGroup, DropdownButton, MenuItem } from 'react-bootstrap'
import _ from 'lodash'
import moment from 'moment'

export default React.createClass({
  mixins: [ 
    Reflux.connect(EffortStore, 'segmentdata') 
  ],
  monthOpts: [
    { value: 0, label: 'January' },
    { value: 1, label: 'February' },
    { value: 2, label: 'March' },
    { value: 3, label: 'April' },
    { value: 4, label: 'May' },
    { value: 5, label: 'June' },
    { value: 6, label: 'July' },
    { value: 7, label: 'August' },
    { value: 8, label: 'September' },
    { value: 9, label: 'October' },
    { value: 10, label: 'November' },
    { value: 11, label: 'December' }
  ],
  yearOpts: [
    { value: 2010, label: '2010' },
    { value: 2011, label: '2011' },
    { value: 2012, label: '2012' },
    { value: 2013, label: '2013' },
    { value: 2014, label: '2014' },
    { value: 2015, label: '2015' },
    { value: 2016, label: '2016' },
    { value: 2017, label: '2017' },
    { value: 2018, label: '2018' },
    { value: 2019, label: '2019' },
    { value: 2020, label: '2020' }
  ],
  getInitialState() {
    return {
      month: new Date().getMonth(),
      monthStr: new Date().toLocaleString('en-au', { month: 'long' }),
      year: new Date().getFullYear()
    }
  },
  monthSelected(opt) {
    if(this.state.month !== opt.value) {
      this.setState({
        month: opt.value,
        monthStr: opt.label
      })
      this.dateChanged(this.state.year, opt.value)
    }
  },
  yearSelected(opt) {
    if(this.state.year !== opt.value) {
      this.setState({
        year: opt.value
      })
      this.dateChanged(opt.value, this.state.month)
    }
  },
  dateChanged(year, month) {
    const segs = this.state.segmentdata.segments
    segs.map(s => { 
      _.unset(s, 'effortsmonth') 
    })
    this.setState( { 'segmentdata': { 'segments': segs } })
    const initial = moment.utc([ year, month ])
    EffortActions.getAllEffortsForSegments(initial.toISOString(), initial.endOf('month').toISOString())
  },
  render() {
    const segs = this.state.segmentdata.segments

    return (
      <div>
        <div>
          <Select className="month" value={this.state.month} options={this.monthOpts} onChange={this.monthSelected} clearable={false} />
          <Select className="year" value={this.state.year} options={this.yearOpts} onChange={this.yearSelected} clearable={false} />
        </div>
        <hr />
        <div>
          <SpinnerWrapper showSpinner={ _.isEmpty(segs) }>
            <SegmentList segments={segs} month={this.state.monthStr} />
          </SpinnerWrapper>
        </div>
      </div>
    )
  }
})
