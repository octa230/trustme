'use client'


import { useRouter } from 'next/navigation'
import React from 'react'
import { Row, Card, Col, InputGroup, Form, Button } from 'react-bootstrap'

export default function page() {
  const router = useRouter()

  return (
    <div>
      <h1>Returns</h1>

      <Row>
        <Col>
          <Card>
            <Card.Header className='d-flex justify-content-between'>
              <Card.Title>Return From Customer</Card.Title>
              <Button variant='outline-dark' onClick={()=> router.push('./CustomerReturnList')}>☰</Button>
            </Card.Header>
            <InputGroup className='p-2' aria-describedby='addon'>
              <Form.Control type='text' placeholder='invoice number'/>
              <Button variant='outline-secondary' id='addon'>🔍</Button>
            </InputGroup>
          </Card>
        </Col>
        <Col>
          <Card>
            <Card.Header className='d-flex justify-content-between'>
              <Card.Title>Return To Supplier</Card.Title>
              <Button variant='outline-dark' onClick={()=> router.push('./SupplierReturnList')}>☰</Button>
            </Card.Header>
            <InputGroup className='p-2' aria-describedby='addon'>
              <Form.Control type='text' placeholder='purchase number'/>
              <Button variant='outline-secondary' id='addon'>🔍</Button>
            </InputGroup>
          </Card>
        </Col>
      </Row>
    </div>
  )
}
