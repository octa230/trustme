'use client'

//import Calender from '@/app/components/Calender'
import React from 'react'
import {Container, ButtonToolbar, Col, Row, Form, 
  ButtonGroup, Table, Button } from 'react-bootstrap'


export default function page() {
  return (
    <div>
      <Container fluid>
      <h1>Units List</h1>
      <Row className='bg-light p-3 border'>
      <ButtonToolbar className='mb-2'>

        <Col className='m-1 col-xs-12'>
        <Form.Control type='text' placeholder='Unit Name'/>
        </Col>

        <Col className='m-1 col-xs-12 d-flex'>
        <ButtonGroup>
        <Button size='md' variant='outline-danger'>RESET</Button>
        <Button size='md' variant='outline-warning'>SEARCH</Button>
        </ButtonGroup>
        <Col className='mx-3'>
          <Button variant='danger'>ADD UNIT</Button>
        </Col>
        </Col>
      </ButtonToolbar>
  
      </Row>

      <Table striped='columns' bordered hover className='m-2'>
        <thead>
          <tr>
            <th>#</th>
            <th>ctrlId</th>
            <th>Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody></tbody>
      </Table>
    </Container>
    </div>
  )
}
