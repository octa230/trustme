'use client'

import { round2 } from '../../utils'
import {Container, ButtonToolbar, Col, Row, Form, ButtonGroup, Button, Table, InputGroup, Stack, Badge } from 'react-bootstrap'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'


export default function SaleListPage() {

  const [sales, setSales] = useState([])
  const [limit, setLimit] = useState(null)
  const [date, setDate]= useState({
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  })

  useEffect(()=>{
    const getSales = async()=>{
      const {data} = await axios.get(`/api/sales?startDate=${date.startDate}&endDate=${date.endDate}&limit=${limit}`)
      //console.log(data)
      setSales(data)
    }

    getSales()
  }, [date.startDate, date.endDate, limit])

  const handlePrintSale = async (invoiceNo, controlId, customerId) => {
  if (window.confirm(`Print Invoice ${invoiceNo}`)) {
    toast.promise(
      axios
        .post(
          `/api/print/invoice/${invoiceNo}/${controlId}/${customerId}`,
          {},
          { responseType: "blob" }
        )
        .then((response) => {
          const blob = new Blob([response.data], { type: "application/pdf" });
          const url = window.URL.createObjectURL(blob);
          window.open(url, "_blank");
        }),
      {
        pending: "...wait",
        success: "Success",
        error: "Failed to Print Invoice",
      }
    );
  }
  };

  return (
    <Container fluid>
    <h1>Invoice/Sales List</h1>
    <Row className='bg-light p-3 border'>
    <ButtonToolbar className='mb-2'>
      <Col className='col-md-2'>
        <Form.Control type='date' 
          value={date.startDate}
          onChange={(e)=> setDate(prevDate => ({...prevDate, startDate: e.target.value}))}
        />
      </Col>
      <Col className='mx-1 col-md-2'>
        <Form.Control type='date' 
          value={date.endDate}
          onChange={(e)=> setDate(prevDate => ({...prevDate, endDate: e.target.value}))}
        />
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
          <Form.Select onChange={(e)=> setLimit(e.target.value)}>
            <option>--entries--</option>
            {[5, 10, 100, 150, 200, 250, 500].map((x, index)=>(
              <option key={index} value={x}>{x}</option>
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
        <Button variant='danger' onClick={(e)=> {
          if(window.confirm('Are you sure you want to add a new invoice?')) {
            window.location.href = '/dashboard/Sales'
          }
        }}>ADD INVOICE</Button>
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
            <td>{sale?.status}</td>
            <td>x days</td>
            <td>
              <Stack gap={2}>
                <Button variant='outline-info btn-sm'>🖊</Button>
                <Button variant='outline-success btn-sm' onClick={()=>handlePrintSale(sale.invoiceNo, sale.controlId, sale.customerId)}>
                  🖨
                </Button>
                <Button variant='outline-danger btn-sm'>❌</Button>
              </Stack>
            </td>
          </tr>
        ))}
      </tbody>
      <tfoot>
          <tr>
            <th colSpan={5}>Totals</th>
            <td>{round2(sales.reduce((acc, sale)=> acc + sale.totalWithoutVat, 0))}</td>
            <td>{round2(sales.reduce((acc, sale)=> acc + sale.totalAfterDiscount, 0))}</td>
            <td>{round2(sales.reduce((acc, sale)=> acc + sale.cashAmount, 0))}</td>
            <td>{round2(sales.reduce((acc, sale)=> acc + sale.cardAmount, 0))}</td>
            <td>{round2(sales.reduce((acc, sale)=> acc + sale.bankAmount, 0))}</td>
            <td>{round2(sales.reduce((acc, sale)=> acc + sale.paidAmount, 0))}</td>
            <td>{round2(sales.reduce((acc, sale)=> acc + sale.pendingAmount, 0))}</td>
          </tr>
      </tfoot>
    </Table>
  </Container>
  )
}
