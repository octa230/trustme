'use client'

import axios from 'axios'
//import Calender from '@/app/components/Calender'
import React, { useEffect, useState } from 'react'
import {Container, ButtonToolbar, Col, Row, Form, 
  ButtonGroup, Table, Button, Stack, Modal} from 'react-bootstrap'


const UnitsList =()=> {

  const [units, setUnits] = useState([])
  const [unit, setUnit] = useState({
    name:''
  })

  const [showModal, setShowModal] = useState(false)


  const getUnits =async()=>{
    const {data} = await axios.get(`/api/units`)
    setUnits(data)
  }

  const addUnit = async(e)=>{
    e.preventDefault()
    unit.code ?
    updateUnit(unit) :
    console.log('unit', unit.name)
    const {data} = await axios.post(`/api/units`, unit)
    setUnits([...units, data])
    setShowModal(false)
  }
  const updateUnit =async(unit)=>{
    setUnit(unit)
    setShowModal(true)


    const {data} = await axios.put(`/api/units/${unit._id}`, unit)
    setUnits(units.map(u => u._id === data._id ? data : u))
    setShowModal(false)
  }

  const deleteUnit =async(id)=>{
    if(!window.confirm('Are you sure you want to delete this unit?')) return
    setUnit({})
    await axios.delete(`/api/units/${id}`)
    setUnits(units.filter(u => u._id !== id))
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
          <Button variant='danger' onClick={()=> {
            setUnit({name: ''})
            setShowModal(true)
          }}>ADD UNIT</Button>
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
                  <Button className='mx-1' onClick={()=> {
                    setShowModal(true)
                    setUnit(unit)
                  }}>Edit</Button>
                  <Button variant='danger' onClick={()=> deleteUnit(unit._id)}>Del</Button>
                </Stack>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
    <Modal show={showModal} onHide={()=> setShowModal(false)} size='lg'>
      <Modal.Header closeButton>
        <Modal.Title>Unit Form</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={addUnit}>
          <Form.Group className='mb-3'>
            <Form.Label>Unit Name</Form.Label>
            <Form.Control type='text' onChange={(e)=> setUnit(prevState => ({...prevState, name: e.target.value}))}
            value={unit.name}
            required
            autoFocus
              placeholder='Enter Unit Name'/>
          </Form.Group>
            <Button variant='primary' type='submit'>Save</Button>
            <Button variant='secondary' onClick={()=> setShowModal(false)} className='mx-2'>Close</Button>
          </Form>
      </Modal.Body>
      </Modal>
    </div>
  )
}


export default UnitsList