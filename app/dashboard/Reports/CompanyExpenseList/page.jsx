'use client'

import Calender from '@/app/components/Calender'
import React from 'react'
import {Container, ButtonToolbar, Col, Row, Form, 
  ButtonGroup, Table, Button } from 'react-bootstrap'


export default function page() {
  return (
    <Container fluid>
    <h1>Company Expense Details</h1>
    <Row className='bg-light p-3 border align-content-center'>
    <ButtonToolbar className='mb-2'>
      <Col className='col-md-2'>
          <Calender title='FromDate'/>
      </Col>
      <Col className='mx-1 col-md-2'>
          <Calender title='EndDate'/>
      </Col>
      <Col className='m-1 col-xs-12'>
          <Form.Control type='text' placeholder='customer Mobile'/>
      </Col>
      <Col className='m-1'>
      <Form.Control type='text' placeholder='customer Name'/>
      </Col>
      <Col>
      <Col className='m-1 col-xs-12'>
      <ButtonGroup>
      <Button size='md' variant='outline-danger'>RESET</Button>
      <Button size='md' variant='outline-warning'>SEARCH</Button>
      <Button size='md' variant='outline-success'>EXCEL</Button>
      <Button size='md'>PRINT</Button>
      <Button size='md' variant='outline-primary'>NEW</Button>
      </ButtonGroup>
      </Col>
      </Col>
    </ButtonToolbar>
    <Row className='d-flex justify-content-between'>
      <Col className='col-md-1'>
        <Form.Group>
          <Form.Select>
            <option>--entries--</option>
            {[100, 150, 200, 250].map((x, index)=>(
              <option key={index}>{x}</option>
            ))}
      </Form.Select>
      </Form.Group>
      </Col>
    </Row>
    </Row>

    <Table striped='columns' bordered hover className='m-2'>
      <thead>
        <tr>
          <th>#</th>
          <th>ctrID</th>
          <th>Date</th>
          <th>Voucher No</th>
          <th>Expense Name</th>
          <th>Files</th>
          <th>Name</th>
          <th>Expense Amount</th>
          <th>Vat</th>
          <th>Expense Total</th>
          <th>Payment Type</th>
          <th>Notes</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody></tbody>
      <tfoot>
          <tr className='border text-danger'>
            <th colSpan={7}>Totals</th>
            <td className='text-danger'>0.00</td>
            <td className='text-danger'>0.00</td>
            <td className='text-danger'>0.00</td>
          </tr>
      </tfoot>
    </Table>
  </Container>
  )
}
