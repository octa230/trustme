'use client'

import React from 'react'
import {Container, ButtonToolbar, Col, Row, Form, ButtonGroup, Card, InputGroup, Button, Table } from 'react-bootstrap'


export default function page() {
  return (
    <div>
      <h1>Employee List</h1>
      <Row className='bg-light p-3 border'>
      <ButtonToolbar className='mb-2'>
        <Col className='m-1 col-xs-12'>
        <Form.Control type='text' placeholder='Employee Mobile'/>
        </Col>
        <Col className='m-1'>
        <Form.Control type='text' placeholder='Employee Name'/>
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
          <Button variant='danger'>ADD EMPLOYEE</Button>
        </Col>
      </Row>
      </Row>

      <Table striped='columns' bordered hover className='m-2'>
        <thead>
          <tr>
            <th>#</th>
            <th>ctrID</th>
            <th>F-Name</th>
            <th>L-Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Sreet</th>
            <th>City</th>
            <th>State</th>
            <th>zipCode</th>
            <th>ctry</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody></tbody>
      </Table>
    </div>
  )
}
