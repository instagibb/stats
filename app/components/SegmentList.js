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
          //_.filter(effs, (e, d, i) => !e.hidden)
          row.unique = _.uniqWith(effs, (a, b) => {
            return a.athlete.id === b.athlete.id
          }).length
        }
 
        return row
      })

      return (
        <div>
          <BootstrapTable data={rows} striped condensed hover search={true} pagination={rows.length > 10} options={ { sizePerPage: 25, noDataText: 'There is no segment data' } }>
            <TableHeaderColumn dataField="id" isKey={true}>Segment ID</TableHeaderColumn>
            <TableHeaderColumn dataField="name">Segment Name</TableHeaderColumn>
            <TableHeaderColumn dataField="location">Location</TableHeaderColumn>
            <TableHeaderColumn dataField="alltime" dataSort={true}>All Time Efforts</TableHeaderColumn>
            <TableHeaderColumn dataField="monthly" dataSort={true}>Monthly Efforts</TableHeaderColumn>
            <TableHeaderColumn dataField="unique" dataSort={true}>Unique Monthly Efforts</TableHeaderColumn>
          </BootstrapTable>
        </div>
      )
    }
    else {
      return (<div>{'No segments...'}</div>)
    }
  }
})
