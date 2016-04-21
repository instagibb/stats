'use strict'

import React from 'react'
import { Button, Glyphicon, Input, Modal } from 'react-bootstrap'

export default class extends React.Component {
  constructor(props) {
    super(props)
    this.state = { 
      name: '', 
      validation: 'error',
      disabled: true 
    }
  }
  handleChange() {
    const toDel = this.refs.name.getValue().trim()
    let validation

    if(toDel === this.props.confirmtext ) {
      validation = 'success'
    }
    else if(toDel.length > 0)
      validation = 'warning'
    else
      validation = 'error'

    this.setState({
      name: toDel,
      validation: validation,
      disabled: toDel !== this.props.confirmtext
    })
  }
  doAction() {
    if(this.refs.name.getValue() === this.props.confirmtext) {
      this.props.action(this.props.entity)
    }
  }
  render() {
    return (
      <Modal show={this.props.show} onHide={this.props.hide} backdrop="static" autoFocus>
        <Modal.Header closeButton>
          <Modal.Title>Danger Zone!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {this.props.children}
          <Input type="text" ref="name" placeholder={this.props.prompt} bsStyle={this.state.validation} onChange={ () => this.handleChange() } />
        </Modal.Body>
        <Modal.Footer>
          <Button disabled={this.state.disabled } bsSize="small" bsStyle="danger" onClick={ () => this.doAction() }><Glyphicon glyph={'trash'} /> Delete</Button>
          <Button bsSize="small" bsStyle="default" onClick={this.props.hide}>Cancel</Button>
        </Modal.Footer>
      </Modal>
    )
  }
}
