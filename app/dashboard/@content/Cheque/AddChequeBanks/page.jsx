'use client'
import React from 'react'
import { Button, Form } from 'react-bootstrap'

export default function page() {
  return (
    <div className='col-md-4'>
      <h1>Add Cheque Banks</h1>
      <Form>
        <Form.Group>
          <Form.Label>Bank Name</Form.Label>
          <Form.Control placeholder='bank name'/>
        </Form.Group>
      </Form>
      <Button type='submit' className='mt-2'>SAVE</Button>
    </div>
  )
}
