'use client'

import Calender from '@/app/components/Calender'
import {Container, ButtonToolbar, Col, Row, Form, ButtonGroup, Card, Dropdown, Button, Table } from 'react-bootstrap'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import XlsExportButon from '@/app/components/XlsExportButon'



const CustomersPage =()=> {

  const [customers, setCustomers] = useState([])

  useEffect(()=>{
    const getCustomers = async()=>{
      try{
        const {data} = await axios.get('/api/customers')
        setCustomers(data)
        console.log(data)
      }catch(error){
        console.log(error)
      }
    }
    getCustomers()
  }, [])

  return (
    <Container fluid>
    <h1>Customer List</h1>
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
      <Col className='m-1'>
      <Form.Control type='text' placeholder='customer Email'/>
      </Col>
      <Col className='m-1'>
      <Form.Control type='text' placeholder='customer TRN'/>
      </Col>
      <Col>
      <Col className='m-1 col-xs-12'>
      <ButtonGroup>
      <Button size='md' variant='outline-danger'>RESET</Button>
      <Button size='md' variant='outline-warning'>SEARCH</Button>
      <XlsExportButon data={customers}/>
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
        <Button variant='danger'>ADD CUSTOMER</Button>
        <Button variant='danger' className='mx-1'>ADD CUSTOMER ADVANCE</Button>
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
          <th>TRN</th>
          <th>Pending Amt</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {customers.map((customer, index) =>(
          <tr key={customer._id}>
            <td>{index}</td>
            <td>{customer.controlId}</td>
            <td>{customer.name}</td>
            <td>{customer.phone}</td>
            <td>{customer.email}</td>
            <td>{customer.trn}</td>
            <td>{customer.pendingAmount || 0}</td>
            <td></td>
          </tr>
        ))}
      </tbody>
    </Table>
  </Container>
  )
}

export default CustomersPage
