'use client'

import axios from 'axios'
//import Calender from '@/app/components/Calender'
import React, { useEffect, useState } from 'react'
import {Container, ButtonToolbar, Col, Row, Form, 
  ButtonGroup, Table, Button, 
  Stack} from 'react-bootstrap'


const UnitsList =()=> {

  const [units, setUnits] = useState([])


  const getUnits =async()=>{
    const {data} = await axios.get(`/api/units`)
    setUnits(data)
  }

  useEffect(()=>{
    getUnits()
  }, [])
  return (
    <div>
      <Container fluid>
      <h1>Units List</h1>
      <Row className='bg-light p-3 border'>
      <ButtonToolbar className='mb-2'>

        <Col className='m-1 col-xs-12'>
        <Form.Control type='text' placeholder='Unit Name'/>
        </Col>

        <Col className='m-1 col-xs-12 d-flex'>
        <ButtonGroup>
        <Button size='md' variant='outline-danger'>RESET</Button>
        <Button size='md' variant='outline-warning'>SEARCH</Button>
        </ButtonGroup>
        <Col className='mx-3'>
          <Button variant='danger'>ADD UNIT</Button>
        </Col>
        </Col>
      </ButtonToolbar>
  
      </Row>

      <Table striped='columns' bordered hover className='m-2' responsive>
        <thead>
          <tr>
            <th>#</th>
            <th>ctrlId</th>
            <th>Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {units.map((unit, index)=> (
            <tr key={unit._id}>
              <td>{index}</td>
              <td>{unit.code}</td>
              <td>{unit.name}</td>
              <td>
                <Stack direction="horizontal" gap={3}>
                  <Button className='mx-1'>Edit</Button>
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


export default UnitsList