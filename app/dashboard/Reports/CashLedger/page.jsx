'use client'

import Calender from '@/app/components/Calender'
import React from 'react'
import {Container, ButtonToolbar, Col, Row, Form, 
  ButtonGroup, Table, Button } from 'react-bootstrap'
  

export default function CashLedgerPage() {
  return (
    <Container fluid>
    <h1>Cash Ledger</h1>
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
      </ButtonGroup>
      </Col>
      </Col>
    </ButtonToolbar>
    <Row>
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
          <th>Name</th>
          <th>Particulars</th>
          <th>Voucher No</th>
          <th>Voucher Type</th>
          <th>Debit</th>
          <th>Credit</th>
          <th>Balance</th>
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
          <tr>
            <th colSpan={3}>Total Advance Given</th>
            <th colSpan={3}>Total Advance Used</th>
            <th colSpan={3}>Total Advance Balance</th>
          </tr>
          <tr>
            <td className='text-danger' colSpan={3}>0.00</td>
            <td className='text-danger' colSpan={3}>0.00</td>
            <td className='text-danger' colSpan={3}>0.00</td>
          </tr>
      </tfoot>
    </Table>
  </Container>
  )
}
