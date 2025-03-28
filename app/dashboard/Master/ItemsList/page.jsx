'use client'

import Calender from '@/app/components/Calender'
import XlsExportButton from '@/app/components/XlsExportButon'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import {Container, ButtonToolbar, Col, Row, Form, 
  ButtonGroup, Table, Button, Modal,InputGroup,  
  Stack} from 'react-bootstrap'

const ItemsList =()=> {

  const [products, setProducts] = useState([])

  const getItems = async()=>{
    const {data}= await axios.get('/api/items')
    setProducts(data)
  }

  useEffect(()=>{
    getItems()
  },[])

  return (
    <div>
      <Container fluid>
      <h1>Items List</h1>
      <Row className='bg-light p-3 border'>
      <ButtonToolbar className='mb-2'>

        <Col className='m-1 col-xs-12'>
        <Form.Control type='text' placeholder='category Name'/>
        </Col>
        <Col className='m-1 col-xs-12'>
        <Form.Control type='text' placeholder='Item Name'/>
        </Col>
        <Col className='m-1 col-xs-12'>
        <Form.Control type='text' placeholder='Barcodes'/>
        </Col>
        <Col className='m-1'>
        <Form.Control type='text' placeholder='Models'/>
        </Col>
        <Col className='m-1'>
        <Form.Control type='text' placeholder='Brands'/>
        </Col>
        <Col>
        <Col className='m-1 col-xs-12'>
        <ButtonGroup>
        <Button size='md' variant='outline-danger'>RESET</Button>
        <Button size='md' variant='outline-warning'>SEARCH</Button>
        <XlsExportButton data={products}/>
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
            <th>Category</th>
            <th>Name</th>
            <th>Units</th>
            <th>inStock</th>
            <th>Price</th>
            <th>Sale Price</th>
            <th>Barcode</th>
            <th>Brand</th>
            <th>Model</th>
            <th>Note</th>
            <th>Files</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index)=> (
            <tr key={product.code}>
              <td>{index +1}</td>
              <td>{product.code}</td>
              <td>{product.category}</td>
              <td>{product.name}</td>
              <td>{product.unit}</td>
              <td>{product.inStock}</td>
              <td>{product.purchasePrice}</td>
              <td>{product.salePrice}</td>
              <td>{product.barcode || 'NA'}</td>
              <td>{product.brand || 'NA'}</td>
              <td>{product.model || 'NA'}</td>
              <td>{product.note || 'NA'}</td>
              <td>{product.files || 'NO FIILES'}</td>
              <td>
                <Stack direction='horizontal' gap={2}>
                  <Button>Edit</Button>
                  <Button variant='danger'>Del</Button>
                </Stack>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
    </div>
  )
}


export default ItemsList