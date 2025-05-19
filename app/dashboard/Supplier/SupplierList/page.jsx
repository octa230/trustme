'use client'

import Calender from '@/app/components/Calender'
import {Container, ButtonToolbar, Col, Row, Form, ButtonGroup, Button, Table } from 'react-bootstrap'
import React, { useEffect, useState } from 'react'
import axios from 'axios'


export default function SupplierListPage() {

  const [suppliers, setSuppliers] = useState([])

  useEffect(()=>{
    const getData=async()=>{
      const {data} = await axios.get(`/api/supplier`)
      setSuppliers(data)
    }
    getData()
  },[])





  return (
    <Container fluid>
    <h1>Supplier List</h1>
    <Row className='bg-light p-3 border shadow-sm rounded'>
    <ButtonToolbar className='mb-2'>
      <Col className='col-md-2'>
      <Calender title='FromDate'/>
      </Col>
      <Col className='mx-1 col-md-2'>
      <Calender title='EndDate'/>
      </Col>
      <Col className='m-1 col-xs-12'>
      <Form.Control type='text' placeholder='Supplier Mobile'/>
      </Col>
      <Col className='m-1'>
      <Form.Control type='text' placeholder='Supplier Name'/>
      </Col>
      <Col className='m-1'>
      <Form.Control type='text' placeholder='Supplier Email'/>
      </Col>
      <Col className='m-1'>
      <Form.Control type='text' placeholder='Supplier TRN'/>
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
      <Col className='col-md-5'>
        <Form.Group>
          <Form.Control type='text' placeholder='search'/>
        </Form.Group>
      </Col>
      <Col>
        <Button variant='danger'>ADD SUPPLIER</Button>
        <Button variant='danger' className='mx-1'>ADD SUPPLIER ADVANCE</Button>
      </Col>
    </Row>
    </Row>
    <div className='d-flex mt-1 bg-light p-2'>
      <Col>
        <h3 className='text-danger'>TOTAL CREDITS</h3>
      </Col>
      <Col className='col-md-3 border'>
      <h3 className='text-danger p-1'>0.00</h3>
      </Col>
    </div>
    <Table striped='columns' bordered hover className='m-2'>
      <thead>
        <tr>
          <th>#</th>
          <th>CtrlNo</th>
          <th>Name</th>
          <th>Phone</th>
          <th>Email</th>
          <th>Address</th>
          <th>TRN</th>
          <th>Pending Amt</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {suppliers.map((supplier, index)=> (
          <tr key={supplier._id}>
            <td>{index}</td>
            <td>{supplier.controlId}</td>
            <td>{supplier.name}</td>
            <td>{supplier.phone}</td>
            <td>{supplier.email}</td>
            <td>{supplier.address}</td>
            <td>{supplier.trn}</td>
            <td>{supplier.pendingAmount || 0}</td>
            <td></td>
          </tr>
        ))}
      </tbody>
    </Table>
  </Container>
  )
}
