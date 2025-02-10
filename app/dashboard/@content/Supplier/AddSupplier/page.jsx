'use client'

import React from 'react'
import { Button, Card, Form } from 'react-bootstrap'


export default function page() {
  return (
    <div>
      <h1>Add Supplier</h1>
      <Card className='col-md-5 p-2'>
        <Card.Header>
          <Card.Title>Supplier</Card.Title>
        </Card.Header>
      <Form>
        <Form.Group>
          <Form.Label>Name</Form.Label>
          <Form.Control type='text'
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Mobile</Form.Label>
          <Form.Control type='text'
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Phone</Form.Label>
          <Form.Control type='text'
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Email</Form.Label>
          <Form.Control type='text'
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Emirate Region</Form.Label>
          <Form.Control type='text'
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Supplier Address</Form.Label>
          <Form.Control type='text'
            placeholder='location/ address'
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Supplier TRN</Form.Label>
          <Form.Control type='text'
            placeholder='Tax Registration Number'
          />
        </Form.Group>
        <Button type='submit' className='mt-3'>SAVE</Button>
      </Form>
      </Card>
    </div>
  )
}
