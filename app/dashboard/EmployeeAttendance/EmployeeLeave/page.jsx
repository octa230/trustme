'use client'

import Calender from '@/app/components/Calender'
import React from 'react'
import { ButtonGroup, Row, Col, Container, Form, Button } from 'react-bootstrap'

export default function EmployeeLeavePage() {
  
  return (
    <div>
      <Container className='col-md-8' fluid>
        <Row className='border p-2'>
          <h1>Add Employee Leave Record</h1>
        <Col className='border p-2'>
        <Form.Group>
          <Form.Label>username</Form.Label>
          <Form.Control type='text'/>
        </Form.Group>
        <Form.Group>
          <Form.Label>Mobile Nō</Form.Label>
          <Form.Control type='text'/>
        </Form.Group>
        <Form.Group>
          <Form.Label>Address</Form.Label>
          <Form.Control type='text' as='textarea' rows={5}/>
        </Form.Group>
          <Calender title='LeaveStart Date'/>
        <Form.Group>
          <Form.Label>Total Leave</Form.Label>
          <Form.Control type='number'/>
        </Form.Group>
        </Col>
        <Col className='border p-2 mx-2'>
        <Form.Group>
          <Form.Label>Control ID</Form.Label>
          <Form.Control type='text'/>
        </Form.Group>
        <Form.Group>
          <Form.Label>Description</Form.Label>
          <Form.Control as='textarea' rows={5} type='text'/>
        </Form.Group>
          <Calender title='Record Date'/>
          <Calender title='LeaveEnd Date'/>
        <Form.Group>
          <Form.Label>Total Paid Leave</Form.Label>
          <Form.Control type='number'/>
        </Form.Group>
        </Col>
        <ButtonGroup className='mt-3'>
          <Button variant='success'>SAVE</Button>
          <Button variant='danger'>CANCEL</Button>
        </ButtonGroup>
        </Row>
      </Container>
    </div>
  )
}
