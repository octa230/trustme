'use client'

import Calender from '@/app/components/Calender'
import {Container, ButtonToolbar, Col, Row, Form, ButtonGroup, Button, Table, InputGroup } from 'react-bootstrap'

export default function page() {
  return (
    <Container fluid>
    <h1>Purchase List</h1>
    <Row className='bg-light p-3 border'>
    <ButtonToolbar className='mb-2'>
      <Col className='col-md-2'>
      <Calender title='FromDate'/>
      </Col>
      <Col className='mx-1 col-md-2'>
      <Calender title='EndDate'/>
      </Col>
      <Col className='m-1 col-xs-12'>
      <Form.Control type='text' placeholder='Purchase Nō'/>
      </Col>
      <Col className='m-1'>
      <Form.Control type='text' placeholder='Purchase INV Nō'/>
      </Col>
      <Col className='m-1'>
      <Form.Control type='text' placeholder='Supplier Name'/>
      </Col>
      <Col> 
        <Form.Select>
          <option>--select--</option>
          {['paid', 'pending', 'partially Paid'].map((x)=>(
            <option>{x}</option>
          ))}
        </Form.Select>
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
        <InputGroup>
          <Form.Control type='text' placeholder='search' aria-describedby='addon1'/>
            <Button id='addon1' variant='outline-dark'>
              🔍
            </Button>
        </InputGroup>
      </Col>
      <Col>
        <Button variant='danger'>ADD PURCHASE</Button>
      </Col>
    </Row>
    </Row>

    <Table striped='columns' bordered hover className='m-2'>
      <thead>
        <tr>
          <th>#</th>
          <th>CtrID</th>
          <th>Puchase No</th>
          <th>InvoiceDate</th>
          <th>Supplier</th>
          <th>Net Amt</th>
          <th>TT Vat</th>
          <th>Grand TT</th>
          <th>G-TT After Discount</th>
          <th>Cash Paid</th>
          <th>Card Paid</th>
          <th>Bank Paid</th>
          <th>Paid Amt</th>
          <th>Pending Amt</th>
          <th>Status</th>
          <th>Files</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody></tbody>
      <tfoot>
          <tr>
            <th colSpan={5}>Totals</th>
            <td>0.00</td>
            <td>0.00</td>
            <td>0.00</td>
            <td>0.00</td>
            <td>0.00</td>
            <td>0.00</td>
            <td>0.00</td>
            <td>0.00</td>
            <td>0.00</td>
          </tr>
      </tfoot>
    </Table>
  </Container>
  )
}
