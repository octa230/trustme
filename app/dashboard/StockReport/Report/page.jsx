'use client'


import axios from 'axios'
import React, { useEffect, useState } from 'react'
import {Container, ButtonToolbar, Col, Row, Form, 
  ButtonGroup, Table, Button, InputGroup } from 'react-bootstrap'

const StockReportPage =()=> {

  const [products, setProducts]= useState([])

  useEffect(()=>{
    const getData =async()=>{
      const {data}= await axios.get(`/api/items`)
      setProducts(data)
    }
    getData()
  }, [])








  return (
    <div>
      <Container fluid>
      <h1>Stock Report</h1>
      <Row className='bg-light p-3 border'>
      <ButtonToolbar className='mb-2'>

        <Col>
        <Col className='m-1 col-xs-12'>
        <ButtonGroup>
          <Button size='md' variant='outline-danger'>RESET</Button>
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
          <Button variant='danger'>ADD ITEM</Button>
        </Col>
      </Row>
      </Row>

      <Table striped='columns' bordered hover className='m-2'>
        <thead>
          <tr>
            <th>#</th>
            <th>ctrlId</th>
            <th>Model</th>
            <th>Name</th>
            <th>Pprice</th>
            <th>Sprice</th>
            <th>In-Qty</th>
            <th>Out-Qty</th>
            <th>inStock</th>
            <th>TT PurchaseAmt</th>
            <th>TT SalesAmt</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index)=> (
            <tr key={product.code}>
              <td>{index}</td>
              <td>{product.code}</td>
              <td>{product.model}</td>
              <td>{product.name}</td>
              <td>{product.purchasePrice}</td>
              <td>{product.salePrice}</td>
              <td>{product.purchased}</td>
              <td>{product.sold}</td>
              <td>{product.inStock}</td>
              <td>{product.purchasePrice * product.purchased}</td>
              <td>{product.purchasePrice * product.salePrice}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <th className='text-danger' colSpan={5}>Totals</th>
            <td className='text-danger'>0.00</td>
            <td className='text-danger'>0.00</td>
            <td className='text-danger'>0.00</td>
            <td className='text-danger'>0.00</td>
            <td className='text-danger'>0.00</td>
            <td className='text-danger'>0.00</td>
            <td className='text-danger'>0.00</td>
          </tr>
        </tfoot>
      </Table>
    </Container>
    </div>
  )
}

export default StockReportPage