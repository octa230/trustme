'use client'

import Calender from '@/app/components/Calender'
import axios from 'axios'
import React from 'react'
import {Container, ButtonToolbar, Col, Row, Form, 
  ButtonGroup, Table, Button, Modal,InputGroup  } from 'react-bootstrap'

export default function page() {

  const getItems = async()=>{
    const {data}= await axios.get('/api/items')
  }

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
        <tbody></tbody>
      </Table>
    </Container>
    </div>
  )
}
