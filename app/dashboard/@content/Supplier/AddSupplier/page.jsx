'use client'

import React from 'react'
import { Button, ButtonGroup, Container, Form } from 'react-bootstrap'


export default function page() {
  return (
    <div>
      <Container className='col-md-5 p-2'>
      <Form className='border p-2 rounded shadow-sm'>
        <h1 className='text-muted'>Add Supplier</h1>
        <hr/>
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
        <ButtonGroup className='mt-2 shadow-sm border'>
          <Button type='submit' variant='success'>SAVE</Button>
          <Button type='submit' variant='danger'>CANCEL</Button>
        </ButtonGroup>
      </Form>
      </Container>
    </div>
  )
}
