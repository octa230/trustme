'use client'
import React from 'react'
import { Button, Form, Container } from 'react-bootstrap'

export default function page() {
  return (
    <Container className='col-md-4'>
      <Form className='rounded shadow-sm border p-2'>
        <h1>Add Cheque Banks</h1>
        <hr/>
        <Form.Group>
          <Form.Label>Bank Name</Form.Label>
          <Form.Control type='text'/>
        </Form.Group>
        <Button type='submit' className='mt-2' variant='success'>SAVE</Button>
      </Form>
    </Container>
  )
}
