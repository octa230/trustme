'use client'

import Calender from '@/app/components/Calender'
import axios from 'axios'
import { useEffect, useState } from 'react'
import {Container, Stack, ButtonToolbar, Col, Row, Form, ButtonGroup, Button, Table, InputGroup } from 'react-bootstrap'

const PurchaseList = ()=> {


  const [purchases, setPurchases] = useState([])
  
  
  
  useEffect(()=>{
    const getData = async()=>{
      const {data} = await axios.get(`/api/purchase`)
      setPurchases(data)
    }

    getData()
  }, [])



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
            <option key={x}>{x}</option>
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
          <th>SUPPLIER</th>
          <th>TOTAL EXCL.VAT</th>
          <th>VAT AMOUNT</th>
          <td>TOTAL</td>
          <th>DISCOUNT AMT</th>
          <th>TT After Discount</th>
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
        {purchases && purchases?.map((purchase, index)=> (
          <tr key={index}>
            <td>{index}</td>
            <td>{purchase.controlId}</td>
            <td>{purchase.purchaseNo}</td>
            <td>{new Date(purchase.createdAt)?.toLocaleDateString()}</td>
            <td>{purchase?.supplierName}</td>
            <td>{purchase?.totalWithoutVat}</td>
            <td>{purchase?.vatAmount}</td>
            <td>{purchase.totalWithVat}</td>
            <td>{purchase.discountAmount}</td>
            <td>{purchase.totalAfterDiscount}</td>
            <td>{purchase?.cashAmount}</td>
            <td>{purchase?.cardAmount}</td>
            <td>{purchase?.bankAmount}</td>
            <td>{purchase?.totalWithVat}</td>
            <td>{purchase?.pendingAmount}</td>
            <td style={{color: purchase.status ? 'red' : 'green'}}>{purchase?.status ? 'PENDING' : 'PAID'}</td>
            <td>🗂️</td>
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
            <td>0.00</td>
            <td>0.00</td>
          </tr>
      </tfoot>
    </Table>
  </Container>
  )
}


export default PurchaseList