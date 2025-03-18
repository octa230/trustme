'use client'

import Calender from '@/app/components/Calender'
import {Container, ButtonToolbar, Col, Row, Form, ButtonGroup, Button, Table, InputGroup, Stack, Badge } from 'react-bootstrap'

import React, { useEffect, useState } from 'react'
import axios from 'axios'


export default function page() {

  const [sales, setSales] = useState([])

  useEffect(()=>{
    const getSales = async()=>{
      const {data } = await axios.get('/api/sales')


      setSales(data)
    }

    getSales()
  }, [])
  return (
    <Container fluid>
    <h1>Invoice/Sales List</h1>
    <Row className='bg-light p-3 border'>
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
        <Button variant='danger'>ADD INVOICE</Button>
      </Col>
    </Row>
    </Row>

    <Table striped='columns' bordered hover className='m-2'>
      <thead>
        <tr>
          <th>#</th>
          <th>CtrID</th>
          <th>Inv No</th>
          <th>Date</th>
          <th>Customer</th>
          <th>Net Amt</th>
          <th>Grand TT</th>
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
      <tbody>
        {sales && sales?.map((sale, index)=> (
          <tr key={sale.controlId}>
            <td>{index}</td>
            <td>{sale.controlId}</td>
            <td>
              <Badge pill>{sale.invoiceNo}</Badge>
            </td>
            <td>{new Date(sale.createdAt).toLocaleDateString()}</td>
            <td>{sale?.customerName}</td>
            <td>{sale?.totalWithoutVat}</td>
            <td>{sale?.totalAfterDiscount}</td>
            <td>{sale?.cashAmount}</td>
            <td>{sale?.cardAmount}</td>
            <td>{sale?.bankAmount}</td>
            <td>{sale?.paidAmount}</td>
            <td>{sale?.pendingAmount}</td>
            <td style={{color: sale.status ? 'red' : 'green'}}>{sale?.status ? 'PENDING' : 'PAID'}</td>
            <td>x days</td>
            <td>
              <Stack gap={2}>
                <Button variant='outline-info btn-sm'>🖊</Button>
                <Button variant='outline-success btn-sm'>🖨</Button>
                <Button variant='outline-danger btn-sm'>❌</Button>
              </Stack>
            </td>
          </tr>
        ))}
      </tbody>
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
          </tr>
      </tfoot>
    </Table>
  </Container>
  )
}
