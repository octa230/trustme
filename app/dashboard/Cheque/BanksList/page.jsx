'use client'

import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Table, Row, Col, ButtonToolbar, ButtonGroup, Button, Form } from 'react-bootstrap'

export default function page() {

  const [banks, setBanks ] = useState([])


  useEffect(()=>{
    const getData = async()=>{
      const {data} = await axios.get(`/api/banks`)

      setBanks(data)
    }

    getData()
  }, [])

  return (
    <div>
      <h1>Banks List</h1>
      <Row className='bg-light p-3 border'>
      <ButtonToolbar className='mb-2'>
        <Col className='m-1'>
        <Form.Control type='text' placeholder='Bank Name'/>
        </Col>
        <Col>
        <Col className='m-1 col-xs-12'>
        <ButtonGroup>
        <Button size='md' variant='outline-danger'>RESET</Button>
        <Button size='md' variant='outline-warning'>SEARCH</Button>
        </ButtonGroup>
        </Col>
        </Col>
      </ButtonToolbar>
      <Row>
        <Col className='col-md-8'>
          <Form.Group>
            <Form.Control type='text' placeholder='search'/>
          </Form.Group>
        </Col>
        <Col>
          <Button variant='danger'>ADD BANK</Button>
        </Col>
      </Row>
      </Row>

      <Table striped='columns' bordered hover className='m-2'>
        <thead>
          <tr>
            <th>#</th>
            <th>ctrID</th>
            <th>Bank Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {banks.map((bank, index)=> (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{bank.controlId}</td>
              <td>{bank.name}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  )
}
