'use client'


import React from 'react'
import { Button, Card, Col, Form, Row } from 'react-bootstrap'

export default function page() {
  return (
    <div>
      <h1>Add Bank Account</h1>
      <Card className='col-md-5 p-2'>
        <Card.Header>
          <Card.Title>Bank Details</Card.Title>
        </Card.Header>
        <Form>
          <Form.Group>
            <Form.Label>Account Name</Form.Label>
            <Form.Control type='text'/>
          </Form.Group>
          <Form.Group>
            <Form.Label>Account Number</Form.Label>
            <Form.Control type='text'/>
          </Form.Group>
          <Form.Group>
            <Form.Label>Bank Name</Form.Label>
            <Form.Control type='text'/>
          </Form.Group>
          <Form.Group>
            <Form.Label>IBAN Number</Form.Label>
            <Form.Control type='text'/>
          </Form.Group>
          <Form.Group>
            <Form.Label>Swift</Form.Label>
            <Form.Control type='text'/>
          </Form.Group>
        </Form>
        <div className='d-flex align-self-end'>
          <Col>
              <Button type='submit' className='m-2'>SAVE</Button>
            </Col>
            <Col>
              <Button variant='danger' className='m-2'>CANCEL</Button>
          </Col>
        </div>
      </Card>
    </div>
  )
}
