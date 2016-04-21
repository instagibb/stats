'use strict'

import React from 'react'
import { Button, ButtonGroup, Glyphicon } from 'react-bootstrap'
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table'
import 'react-bootstrap-table/css/react-bootstrap-table-all.min.css'
import Bar from './loading/Bar'
import _ from 'lodash'
import moment from 'moment'
import numeral from 'numeral'

export default React.createClass({
  propTypes: {
    segments: React.PropTypes.array
  },

  render() {
    const m = this.props.month
    const y = this.props.year
    const segments = this.props.segments
    const actions = this.props.actions
    const bar = <Bar />
    if (!_.isEmpty(segments)) { 
      let rows = segments.map((segment) => {
        let row = {}
        row.id = segment.id
        row.name = segment.name
        row.location = segment.park
        row.alltime = segment.effort_count
        row.athletes = segment.athlete_count
        let effs = segment[y]
        if(!_.isEmpty(effs)) {
          // YTD ending on selected month
          let startytd = moment.utc([ y ]).startOf('year')
          let endytd = moment.utc([ y, m ]).endOf('month')
          let ytdeffs = _.filter(effs, (e) => {
            return moment.utc(e.start_date_local).isBetween(startytd, endytd)
          })
          row.ytd = ytdeffs.length
          row.ytdunique = _.uniqWith(ytdeffs, (a, b) => {
            return a.athlete.id === b.athlete.id
          }).length
          
          // Monthly
          const end = moment.utc([ y, m ])
          let montheffs = _.filter(effs, (e) => {
            return moment.utc(e.start_date_local).isSame(end, 'month')
          })
          row.monthly = montheffs.length
          row.monthlyunique = _.uniqWith(montheffs, (a, b) => {
            return a.athlete.id === b.athlete.id
          }).length
        }
        else if(_.isUndefined(effs)) {
          row.ytd = bar
          row.ytdunique = bar
          row.monthly = bar
          row.monthlyunique = bar
        }
        else {
          row.ytd = -1
          row.ytdunique = -1
          row.monthly = -1
          row.monthlyunique = -1
        }

        if(!_.isEmpty(actions)) {
          const buttons = actions.map((a, index) => {
            return <Button ref bsSize="small" key={index} bsStyle={a.style} onClick={a.handler.bind(null, segment)}><Glyphicon glyph={a.icon} /> {a.name}</Button>
          })

          row.buttons = buttons.length > 1 ? <ButtonGroup>{buttons}</ButtonGroup> : buttons
        }

        return row
      })

      const countFormat = (cell) =>  _.isNumber(cell) ? (cell !== -1 ? numeral(cell).format('0,0') : 'N/A') : cell 
      const shortMonth = moment.monthsShort(m)

      return (
        <div>
          <BootstrapTable data={rows} striped condensed hover search={false} pagination={rows.length > 25} options={ { sizePerPage: 25, noDataText: 'There is no segment data' } }>
            <TableHeaderColumn width="80" dataAlign="right" dataField="id" dataSort={true} isKey={true}>ID</TableHeaderColumn>
            <TableHeaderColumn dataField="name">Name</TableHeaderColumn>
            <TableHeaderColumn dataField="location">Location</TableHeaderColumn>
            <TableHeaderColumn width="130" dataAlign="right" dataField="alltime" dataFormat={countFormat} dataSort={true}>Total Efforts</TableHeaderColumn>
            <TableHeaderColumn width="130" dataAlign="right" dataField="athletes" dataFormat={countFormat} dataSort={true}>Total Riders</TableHeaderColumn>
            <TableHeaderColumn dataAlign="right" dataField="ytd" dataFormat={countFormat} dataSort={true}>YTD Efforts</TableHeaderColumn>
            <TableHeaderColumn dataAlign="right" dataField="ytdunique" dataFormat={countFormat} dataSort={true}>YTD Riders</TableHeaderColumn>
            <TableHeaderColumn dataAlign="right" dataField="monthly" dataFormat={countFormat} dataSort={true}>{shortMonth} Efforts</TableHeaderColumn>
            <TableHeaderColumn dataAlign="right" dataField="monthlyunique" dataFormat={countFormat} dataSort={true}>{shortMonth} Riders</TableHeaderColumn>
            <TableHeaderColumn dataField="buttons" dataAlign="center" dataSort={false} hidden={_.isEmpty(actions)}>Actions</TableHeaderColumn>
          </BootstrapTable>
        </div>
      )
    }
    else {
      return (<div>{'No segments...'}</div>)
    }
  }
})
