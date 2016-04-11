'use strict'

import React from 'react'
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table'
import Bar from './loading/Bar'
import _ from 'lodash'
import numeral from 'numeral'

export default React.createClass({
  propTypes: {
    segments: React.PropTypes.array
  },

  render() {
    const segments = this.props.segments
    const bar = <Bar />
    if (!_.isEmpty(segments)) { 
      let rows = segments.map((segment, index) => {
        let row = {}
        row.id = segment.id
        row.name = segment.name
        row.location = `${segment.city}`
        row.alltime = segment.effort_count
        row.athletes = segment.athlete_count
        let effs = segment.effortsmonth
        if(!_.isEmpty(effs)) {
          row.monthly = numeral(effs.length).format('0,0')
          //_.filter(effs, (e, d, i) => !e.hidden)
          row.unique = numeral(_.uniqWith(effs, (a, b) => {
            return a.athlete.id === b.athlete.id
          }).length).format('0,0')
        }
        else if(_.isUndefined(effs)) {
          row.monthly = bar
          row.unique = bar
        }
        else {
          row.monthly = -1
          row.unique = -1
        }
 
        return row
      })

      const countFormat = (cell) =>  _.isNumber(cell) ? (cell !== -1 ? numeral(cell).format('0,0') : 'N/A') : cell 

      return (
        <div>
          <BootstrapTable data={rows} striped condensed hover search={false} pagination={rows.length > 10} options={ { sizePerPage: 25, noDataText: 'There is no segment data' } }>
            <TableHeaderColumn dataField="id" isKey={true}>Segment ID</TableHeaderColumn>
            <TableHeaderColumn dataField="name">Name</TableHeaderColumn>
            <TableHeaderColumn dataField="location">Location</TableHeaderColumn>
            <TableHeaderColumn dataField="athletes" dataFormat={countFormat} dataSort={true}>All Time Riders</TableHeaderColumn>
            <TableHeaderColumn dataField="alltime" dataFormat={countFormat} dataSort={true}>All Time Efforts</TableHeaderColumn>
            <TableHeaderColumn dataField="monthly" dataFormat={countFormat} dataSort={true}>Monthly Efforts</TableHeaderColumn>
            <TableHeaderColumn dataField="unique" dataFormat={countFormat} dataSort={true}>Monthly Unique Efforts</TableHeaderColumn>
          </BootstrapTable>
        </div>
      )
    }
    else {
      return (<div>{'No segments...'}</div>)
    }
  }
})
