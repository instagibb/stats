'use strict'

import React from 'react'
import { Button, Glyphicon, Input, Modal } from 'react-bootstrap'

export default React.createClass({
  getInitialState() {
    return {
      validationErrs: {}
    }
  },
  buildSegment() {
    const segment = {
      id: this.props.segment.id,
      name: this.refs.name.getValue()
    }
    return segment
  },
  doAction() {
    this.props.action(this.buildSegment())
  },
  closeError() {
    this.props.errorHandler()
  },
  render() {
    const segment = this.props.segment
    const form = (
      <form>
        <Input type="text" label="ID" ref="id" placeholder="ID..." defaultValue={segment.id} />
        <Input type="text" label="Name" ref="name" placeholder="Name..." defaultValue={segment.name} />
      </form>
    )
    const type = this.props.type
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
