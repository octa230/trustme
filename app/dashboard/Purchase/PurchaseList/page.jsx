'use client'

import Calender from '@/app/components/Calender'
import XlsExportButton from '@/app/components/XlsExportButon'
import axios from 'axios'
import { useEffect, useState } from 'react'
import {Container, Stack, ButtonToolbar, Col, Row, Form, ButtonGroup, Button, Table, InputGroup, Badge } from 'react-bootstrap'
import { toast } from 'react-toastify'
import { round2 } from '../../utils'

const PurchaseList = ()=> {


  const [purchases, setPurchases] = useState([])
  const [limit, setLimit] = useState(null)
  const [date, setDate] = useState({
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  })
  
  //const startDateStr = date.startDate? // YYYY-MM-DD format
  //const endDateStr = date.endDate?
  
  
  useEffect(()=>{
    const getData = async()=>{
      const {data} = await axios.get(`/api/purchase?startDate=${date.startDate}&endDate=${date.endDate}&limit=${limit}`)
      setPurchases(data)
    }

    getData()
  }, [date.startDate, date.endDate, limit])

  const handlePrintPurchase=async(purchaseNo, controlId, supplierId)=>{
    if(window.confirm(`print purchase ${purchaseNo}?`)){
      toast.promise(
        axios.post(`/api/print/purchase/${purchaseNo}/${controlId}/${supplierId}`, 
          {}, 
          { responseType:"blob" }
        ).then((response)=>{
          const blob = new Blob([response.data], {type: "application/pdf"});
          const url = window.URL.createObjectURL(blob)
          window.open(url, "_blank")
        }),
        {
          pending:"...wait",
          success: "Done",
          error: "Oops try again!"
        }
      )
    }
  }


  return (
    <Container fluid>
    <h1>Purchase List</h1>
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
      <XlsExportButton data={purchases}/>
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
          <th>Date</th>
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
            <td>
              <Badge>
              {purchase.purchaseNo}
              </Badge>
            </td>
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
            <td>{purchase?.paidAmount}</td>
            <td>{purchase?.pendingAmount}</td>
            <td style={{color: purchase.status ? 'red' : 'green'}}>{purchase?.status ? 'PENDING' : 'PAID'}</td>
            <td>🗂️</td>
            <td>
              <Stack gap={2}>
                <Button variant='outline-info btn-sm'>🖊</Button>
                <Button variant='outline-success btn-sm' onClick={()=> handlePrintPurchase(purchase.purchaseNo, purchase.controlId, purchase.supplierId)}>
                  🖨
                </Button>
              </Stack>
            </td>
          </tr>
        ))}
      </tbody>
      <tfoot>
          <tr>
            <th colSpan={5}>Totals</th>
            <td>{round2(purchases.reduce((acc, purchase)=> acc + purchase.totalWithoutVat, 0))}</td>
            <td>{round2(purchases.reduce((acc, purchase)=> acc + purchase.vatAmount, 0))}</td>
            <td>{round2(purchases.reduce((acc, purchase) => acc + purchase.totalWithVat, 0))}</td>
            <td>{round2(purchases.reduce((acc, purchase)=> acc + purchase.discountAmount, 0))}</td>
            <td>{round2(purchases.reduce((acc, purchase)=> acc + purchase.totalAfterDiscount, 0))}</td>
            <td>{round2(purchases.reduce((acc, purchase)=> acc + purchase.cashAmount, 0))}</td>
            <td>{round2(purchases.reduce((acc, purchase)=> acc + purchase.cardAmount, 0))}</td>
            <td>{round2(purchases.reduce((acc, purchase)=> acc + purchase.bankAmount, 0))}</td>
            <td>{round2(purchases.reduce((acc, purchase)=> acc + purchase.paidAmount, 0))}</td>
            <td>{round2(purchases.reduce((acc, purchase)=> acc + purchase.pendingAmount, 0))}</td>
          </tr>
      </tfoot>
    </Table>
  </Container>
  )
}


export default PurchaseList