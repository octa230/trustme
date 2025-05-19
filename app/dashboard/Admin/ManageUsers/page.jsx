'use client'

import React from 'react'
import { Button, Col, Row } from 'react-bootstrap'

export default function page() {
  return (
    <div>
      <h1>Manage Users</h1>
      <Row>
        <Col>
          <Button>Create USER</Button>
        </Col>
      </Row>
    </div>
  )
}

const ModalComponent =({user, visibility})=>{
  return(
    <Modal show={visibility} onHide={visibility}>
    <Modal.Header closeButton>
      <Modal.Title>{user?.name}</Modal.Title>
    </Modal.Header>

    <Modal.Footer>
      <Button>{user.name ? 'UPDATE' : 'SAVE'}</Button>
      <Button variant='danger'>CANCEL</Button>
    </Modal.Footer>
  </Modal>
  )
}