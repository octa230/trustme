'use client'

import Calender from '@/app/components/Calender'
import XlsExportButton from '@/app/components/XlsExportButon'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import {Container, ButtonToolbar, Col, Row, Form, 
  ButtonGroup, Table, Button, InputGroup, 
  Stack} from 'react-bootstrap'

const QuotationList =  () => {

  const [quotations, setQuotations] = useState([])

  const getData = async()=>{
    const {data} = await axios.get(`/api/quotation`)
    setQuotations(data)
  } 


  useEffect(()=>{
    getData()
  }, [])
  return (
    <Container fluid>
      <h1>Quotations List</h1>
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
        <XlsExportButton data={quotations}/>
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
          <Button variant='danger'>ADD QUOTATION</Button>
        </Col>
      </Row>
      </Row>

      <Table striped='columns' bordered hover className='m-2'>
        <thead>
          <tr>
            <th>#</th>
            <th>ctrID</th>
            <th>Quote No</th>
            <th>Date</th>
            <th>Customer</th>
            <th>Total</th>
            <th>Vat</th>
            <th>TTIncl.Vat</th>
            <th>Discount</th>
            <th>Approval</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {quotations?.map((quotation, index)=> (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{quotation.controlId}</td>
              <td>{quotation.quotationNo}</td>
              <td>{new Date(quotation.createdAt)?.toLocaleDateString()}</td>
              <td>{quotation.customerName}</td>
              <td>{quotation.totalWithoutVat}</td>
              <td>{quotation.vatAmount}</td>
              <td>{quotation.totalWithVat}</td>
              <td>{quotation.discountAmount}</td>
              <td style={{color: quotation.approved ? 'greenyellow' : 'tomato'} }>
                {quotation.approved ? 'APPROVED' : 'PENDING'}
              </td>
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
              <td>{quotations.reduce((acc, curr)=> acc + curr.totalWithoutVat, 0)}</td>
              <td>{quotations.reduce((acc, curr) => acc + curr.vatAmount, 0)}</td>
              <td>{quotations.reduce((acc, curr)=> acc + curr.totalWithVat, 0)}</td>
              <td>{quotations.reduce((acc, curr)=> acc + curr.discountAmount, 0 )}</td>
            </tr>
        </tfoot>
      </Table>
    </Container>
  )
}


export default QuotationList
