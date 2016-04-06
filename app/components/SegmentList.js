'use strict'

import React from 'react'
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table'
import _ from 'lodash'

export default React.createClass({
  propTypes: {
    segments: React.PropTypes.array
  },
  render() {
    const segments = this.props.segments
    if (!_.isEmpty(segments)) { 
      let rows = segments.map((segment, index) => {
        let row = {}
        row.id = segment.id
        row.name = segment.name
        row.location = `${segment.city}`
        row.alltime = segment.effort_count
        let effs = segment.effortsmonth
        if(!_.isEmpty(effs)) {
          row.monthly = effs.length
          row.unique = _.uniqWith(effs, (a, b) => {
            return a.athlete.id === b.athlete.id
          }).length
        }
 
        return row
      })
      console.log(rows)

      return (
        <BootstrapTable data={rows} striped condensed hover search={true} pagination={rows.length > 10} options={ { sizePerPage: 25, noDataText: 'There is no segment data' } }>
          <TableHeaderColumn dataField="id" isKey={true}>Segment ID</TableHeaderColumn>
          <TableHeaderColumn dataField="name">Segment Name</TableHeaderColumn>
          <TableHeaderColumn dataField="location">Location</TableHeaderColumn>
          <TableHeaderColumn dataField="alltime">All Time Efforts</TableHeaderColumn>
          <TableHeaderColumn dataField="monthly">Monthly Efforts</TableHeaderColumn>
          <TableHeaderColumn dataField="unique">Unique Monthly Efforts</TableHeaderColumn>
        </BootstrapTable>
      )
    }
    else {
      return (<div>{'No segments...'}</div>)
    }
  }
})
