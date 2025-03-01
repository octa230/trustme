'use client'

import Calender from '@/app/components/Calender'
import React from 'react'
import {Container, ButtonToolbar, Col, Row, Form, 
  ButtonGroup, Table, Button } from 'react-bootstrap'


export default function page() {
  return (
    <Container fluid>
      <h1>Purchase Cheque List</h1>
      <Row className='bg-light p-3 border'>
      <ButtonToolbar className='mb-2'>
        <Col className='col-md-2'>
        <Calender title='Date'/>
        </Col>
        <Col className='m-1 col-xs-12'>
        <Form.Control type='text' placeholder='Purchase Nō'/>
        </Col>
        <Col className='m-1'>
        <Form.Control type='text' placeholder='Supplier Name'/>
        </Col>
        <Col>
        <Col className='m-1 col-xs-12'>
        <ButtonGroup>
          <Button size='md' variant='outline-danger'>RESET</Button>
          <Button size='md' variant='outline-warning'>SEARCH</Button>
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
        <Col className='col-md-8'>
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
            <th>ctrID</th>
            <th>Cheque Date</th>
            <th>Purchase Nō</th>
            <th>Supplier</th>
            <th>Bank</th>
            <th>Amount</th>
            <th>Paid Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody></tbody>
        <tfoot>
            <tr>
              <th colSpan={6}>Totals</th>
              <td>0.00</td>
            </tr>
        </tfoot>
      </Table>
    </Container>
  )
}
