'use strict'

import React from 'react'
import Reflux from 'reflux'
import AuthStore from '../stores/AuthStore'
import ConfirmationDialog from '../components/ConfirmationDialog'
import EffortActions from '../actions/EffortActions'
import EffortStore from '../stores/EffortStore'
import SegmentActions from '../actions/SegmentActions'
import SegmentStore from '../stores/SegmentStore'
import SegmentList from '../components/SegmentList'
import SegmentDialog from '../components/SegmentDialog'
import SpinnerWrapper from '../components/loading/SpinnerWrapper'
import Select from 'react-select'
import '../../node_modules/react-select/dist/react-select.css'
import { Alert, Button, Glyphicon } from 'react-bootstrap'

export default React.createClass({
  mixins: [ 
    Reflux.connect(EffortStore, 'segmentdata'),
    Reflux.listenTo(EffortStore, 'segmentDataChange' )
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
      year: new Date().getFullYear(),
      modalShow: false,
      modalType: '',
      modalAction: {},
      modalSegment: {}
    }
  },
  segmentDataChange() {
    if(this.state.modalShow) {
      this.closeSegmentDialog()
    }
    if(this.state.confirmShow) {
      this.closeConfirm()
    }
  },
  addClicked() {
    this.openSegmentDialog('Add', this.addSegment, {})
  },
  editClicked(segment) {
    this.openSegmentDialog('Edit', this.editSegment, segment)
  },
  deleteClicked(segment) {
    this.openConfirm('Delete', this.deleteSegment, segment)
  },
  addSegment(segment) {
    SegmentActions.addSegment(segment)
  },
  editSegment(segment) {
    SegmentActions.editSegment(segment)
  },
  deleteSegment(segment) {
    SegmentActions.deleteSegment(segment)
  },
  openSegmentDialog(type, action, segment) {
    this.setState({ 
      modalShow: true,
      modalType: type,
      modalAction: action,
      modalSegment: segment
    })
  },
  closeSegmentDialog() {
    this.setState({ 
      modalShow: false,
      modalType: '',
      modalAction: {},
      modalSegment: {}
    })
  },
  openConfirm(type, action, segment) {
    this.setState({ 
      confirmShow: true,
      confirmType: type,
      confirmAction: action,
      confirmSegment: segment
    })
  },
  closeConfirm() {
    this.setState({ 
      confirmShow: false,
      confirmType: '',
      confirmAction: {},
      confirmSegment: {}
    })
  },
  monthSelected(opt) {
    if(this.state.month !== opt.value) {
      this.setState({
        month: opt.value,
        monthStr: opt.label
      })
      this.dateChanged(this.state.year)
    }
  },
  yearSelected(opt) {
    if(this.state.year !== opt.value) {
      this.setState({
        year: opt.value
      })
      this.dateChanged(opt.value)
    }
  },
  dateChanged(year) {
    EffortActions.getAllEffortsForSegments(year)
  },
  render() {
    const segs = this.state.segmentdata.segments
    const addButton = AuthStore.isAdmin() ? <Button className="addbutton" bsSize="small" bsStyle="primary" onClick={this.addClicked}><Glyphicon glyph="plus" /> Add Segment</Button> : null
    const segmentDiag = AuthStore.isAdmin() ? this.getSegmentDialog() : null
    const confirmDiag = AuthStore.isAdmin() ? this.getConfirmDialog() : null
    
    return (
      <div>
        <div>
          <Select className="month" value={this.state.month} options={this.monthOpts} onChange={this.monthSelected} clearable={false} />
          <Select className="year" value={this.state.year} options={this.yearOpts} onChange={this.yearSelected} clearable={false} />
        </div>
        <hr />
        <div>
          <SpinnerWrapper showSpinner={ AuthStore.isLoading() || SegmentStore.isLoading() }>
            {addButton} 
            <SegmentList segments={segs} year={this.state.year} month={this.state.month} monthStr={this.state.monthStr} actions={ this.getActions() }/>
          </SpinnerWrapper>
        </div>
        {segmentDiag}
        {confirmDiag}
      </div>
    )
  },
  getSegmentDialog() {
    return (<SegmentDialog 
      type={this.state.modalType} 
      action={this.state.modalAction} 
      show={this.state.modalShow} 
      hide={this.closeSegmentDialog} 
      segment={this.state.modalSegment} 
      error={this.state.error}
      errorHandler={this.handleError}
    />)
  },
  getConfirmDialog() {
    const confirmText = 'deleteme'
    return (<ConfirmationDialog 
      type={this.state.confirmType} 
      action={this.state.confirmAction} 
      show={this.state.confirmShow} 
      hide={this.closeConfirm} 
      entity={this.state.confirmSegment} 
      error={this.state.error}
      errorHandler={this.handleError}
      confirmtext={confirmText}
    ><Alert bsStyle="danger"><h4>Are you sure you want to do this?</h4>If you are please type the following text into the box below: <strong>{confirmText}</strong></Alert>
    </ConfirmationDialog>
    )
  },
  getActions() {
    if(AuthStore.isAdmin()) {
      return [ { name: '', handler: this.editClicked, icon: 'wrench' }, { name: '', handler: this.deleteClicked, icon: 'trash', style: 'danger' } ]
    }
    else {
      return []
    }

  }
})
