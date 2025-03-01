'use client'

import Calender from '@/app/components/Calender'
import React from 'react'
import {Container, ButtonToolbar, Col, Row, Form, 
  ButtonGroup, Button, Table } from 'react-bootstrap'

export default function page() {
  return (
    <Container fluid>
    <h1>Leads List</h1>
    <Row className='bg-light p-3 border'>

    <ButtonToolbar className='mb-2'>
      <Col className='col-md-2'>
      <Calender title='FromDate'/>
      </Col>
      <Col className='mx-1 col-md-2'>
      <Calender title='EndDate'/>
      </Col>

      <Col className='m-1'>
        <Form.Control type='text' placeholder='customer Name'/>
      </Col>
      <Col>
      <Col className='m-1 col-xs-12'>
      <ButtonGroup>
        <Button size='md' variant='outline-danger'>RESET</Button>
        <Button size='md' variant='info text-dark' className='border border-dark'>SEARCH</Button>
        <Button size='md' variant='outline-success'>EXCEL</Button>
        <Button size='md'>PRINT</Button>
      </ButtonGroup>
      </Col>
      </Col>
    </ButtonToolbar>
    <Row>
      <Col className='col-md-2'>
        <Form.Group>
          <Form.Select>
            <option>--entries--</option>
            {[100, 150, 200, 250].map((x, index)=>(
              <option key={index}>{x}</option>
            ))}
      </Form.Select>
      </Form.Group>
      </Col>
      <Col className='col-md-5'>
        <Form.Group>
          <Form.Control type='text' placeholder='search'/>
        </Form.Group>
      </Col>
    </Row>
    </Row>

    <Table striped='columns' bordered hover className='m-2'>
      <thead>
        <tr>
          <th>#</th>
          <th>CtrlNo</th>
          <th>Name</th>
          <th>Follow Up Date</th>
          <th>Description</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody></tbody>
    </Table>
  </Container>
  )
}
