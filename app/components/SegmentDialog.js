'use strict'

import React from 'react'
import { Button, Glyphicon, Input, Modal } from 'react-bootstrap'

export default React.createClass({
  buildSegment() {
    const segment = {
      id: this.refs.id.getValue(),
      customname: this.refs.name.getValue()
    }
    return segment
  },
  doAction() {
    this.props.action(this.buildSegment())
  },
  render() {
    const type = this.props.type
    const segment = this.props.segment
    const form = (
      <form>
        <Input type="text" disabled={type === 'Edit'} label="ID" ref="id" placeholder="ID..." defaultValue={segment.id} />
        <Input type="text" label="Name" ref="name" placeholder="Name..." defaultValue={segment.customname} />
      </form>
    )
    return (
      <Modal show={this.props.show} onHide={this.props.hide}>
        <Modal.Header closeButton>
          <Modal.Title>{type} Segment {segment.id || ''} </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {form}
        </Modal.Body>
        <Modal.Footer>
          <Button bsSize="small" bsStyle="primary" onClick={this.doAction}><Glyphicon glyph={(type === 'Add') ? 'plus' : 'wrench'} /> {type}</Button>
          <Button bsSize="small" bsStyle="default" onClick={this.props.hide}>Cancel</Button>
        </Modal.Footer>
      </Modal>
    )
  }
})
