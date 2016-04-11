'use strict'

import React from 'react'
import Reflux from 'reflux'
import EffortActions from '../actions/EffortActions'
import EffortStore from '../stores/EffortStore'
import SegmentList from '../components/SegmentList'
import SpinnerWrapper from '../components/loading/SpinnerWrapper'

import { ButtonGroup, DropdownButton, MenuItem } from 'react-bootstrap'
import _ from 'lodash'
import moment from 'moment'

export default React.createClass({
  mixins: [ 
    Reflux.connect(EffortStore, 'segmentdata') 
  ],
  getInitialState() {
    return {
      month: new Date().getMonth(),
      monthStr: new Date().toLocaleString('en-au', { month: 'long' }),
      year: new Date().getFullYear()
    }
  },
  monthSelected(e, k) {
    if(this.state.month !== k) {
      this.setState({
        month: k,
        monthStr: new Date(this.state.year, k).toLocaleString('en-au', { month: 'long' })
      })
      this.dateChanged(this.state.year, k)
    }
  },
  yearSelected(e, k) {
    if(this.state.year !== k) {
      this.setState({
        year: k
      })
      this.dateChanged(k, this.state.month)
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
          <ButtonGroup>
            <DropdownButton title={this.state.monthStr} id="bg-nested-dropdown" onSelect={this.monthSelected}>
              <MenuItem eventKey="0">January</MenuItem>
              <MenuItem eventKey="1">February</MenuItem>
              <MenuItem eventKey="2">March</MenuItem>
              <MenuItem eventKey="3">April</MenuItem>
              <MenuItem eventKey="4">May</MenuItem>
              <MenuItem eventKey="5">June</MenuItem>
              <MenuItem eventKey="6">July</MenuItem>
              <MenuItem eventKey="7">August</MenuItem>
              <MenuItem eventKey="8">September</MenuItem>
              <MenuItem eventKey="9">October</MenuItem>
              <MenuItem eventKey="10">November</MenuItem>
              <MenuItem eventKey="11">December</MenuItem>
            </DropdownButton>
            <DropdownButton title={this.state.year} id="bg-nested-dropdown" onSelect={this.yearSelected}>
              <MenuItem eventKey="2010">2010</MenuItem>
              <MenuItem eventKey="2011">2011</MenuItem>
              <MenuItem eventKey="2012">2012</MenuItem>
              <MenuItem eventKey="2013">2013</MenuItem>
              <MenuItem eventKey="2014">2014</MenuItem>
              <MenuItem eventKey="2015">2015</MenuItem>
              <MenuItem eventKey="2016">2016</MenuItem>
              <MenuItem eventKey="2017">2017</MenuItem>
              <MenuItem eventKey="2018">2018</MenuItem>
              <MenuItem eventKey="2019">2019</MenuItem>
              <MenuItem eventKey="2020">2020</MenuItem>
            </DropdownButton>
          </ButtonGroup>
        </div>
        <hr />
        <div>
          <SpinnerWrapper showSpinner={ _.isEmpty(segs) }>
            <SegmentList segments={segs} />
          </SpinnerWrapper>
        </div>
      </div>
    )
  }
})
