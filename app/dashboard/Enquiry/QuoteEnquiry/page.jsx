'use client'

import React from 'react'
import { Card, Form, Col, Container} from 'react-bootstrap'
import Button from 'react-bootstrap/esm/Button'

const QuotesEnquiry = () => {
  return (
    <Container className='justify-items-center'>
      <h1>Quotation From Enquiry</h1>
      <Card className='col-md-5 p-2'>
        <Form>
          <Form.Group>
            <Form.Label>SEARCH ENQUIRY ID</Form.Label>
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
    </Container>
  )
}

export default QuotesEnquiry
