'use client'

import React from 'react'
import { Container, Form, InputGroup } from 'react-bootstrap'

export default function page() {
  return (
    <div>
      <Container className='col-md-4'>
        <Form className='justify-content-center'>
          <h1 className='text-muted'>Quotation From Enquiry</h1>
          <InputGroup>
           <Form.Control placeholder='Enter Enquiry Nō' type='text'/>
           <InputGroup.Text>SEARCH</InputGroup.Text>
          </InputGroup>
        </Form>
      </Container>
    </div>
  )
}

