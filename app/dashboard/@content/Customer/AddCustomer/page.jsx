"use client"

import React from 'react'
import { Button, Card, Form, Container, Row, ButtonGroup } from 'react-bootstrap'

export default function page() {
  return (
    <Container className='col-md-5'>
      <Form className='justify-content-center border p-2 rounded shadow-sm'>
        <h1 className='text-muted'>Add Customer</h1>
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
          <Form.Label>Address</Form.Label>
          <Form.Control type='text'
            placeholder='location/ address'
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>TRN</Form.Label>
          <Form.Control type='text'
            placeholder='Tax Registration Number'
          />
        </Form.Group>
        <ButtonGroup className='mt-3'>
          <Button type='submit' variant='success'>SAVE</Button>
          <Button type='submit' variant='danger'>CANCEL</Button>
        </ButtonGroup>
      </Form>
    </Container>
  )
}
