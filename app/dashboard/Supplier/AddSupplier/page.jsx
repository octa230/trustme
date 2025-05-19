'use client'

import axios from 'axios'
import React, { useState } from 'react'
import { Button, ButtonGroup, Container, Form } from 'react-bootstrap'
import { toast } from 'react-toastify'


export default function AddSupplierPage() {
  const [supplier, setSupplier] = useState({
    name:"",
    mobile:"",
    phone:"",
    email:"",
    region:"",
    address:"",
    trn:""
  })


  const handleSubmit = async(e)=>{
    e.preventDefault()
    toast.promise(
      axios.post(`/api/supplier`, supplier),
      {
      pending: '...wait',
      success:'Done',
      error: 'Oops try again'
    }, 
    {
      autoClose: 3000,
    })
    setSupplier({})
  }
  return (
    <div>
      <Container className='col-md-5 p-2'>
      <Form className='border p-2 rounded shadow-sm' onSubmit={handleSubmit}>
        <h1 className='text-muted'>Add Supplier</h1>
        <hr/>
        <Form.Group>
          <Form.Label>Name</Form.Label>
          <Form.Control type='text'
            value={supplier.name}
            onChange={(e)=> setSupplier(prevState=> ({...prevState, name: e.target.value}))}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Mobile</Form.Label>
          <Form.Control type='text'
            value={supplier.mobile}
            onChange={(e)=> setSupplier(prevState => ({...prevState, mobile: e.target.value}))}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Phone</Form.Label>
          <Form.Control type='text'
            value={supplier.phone}
            onChange={(e)=> setSupplier(prevState => ({...prevState, phone: e.target.value}))}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Email</Form.Label>
          <Form.Control type='text'
            value={supplier.email}
            onChange={(e)=> setSupplier(prevState=> ({...prevState, email: e.target.value}))}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Emirate Region</Form.Label>
          <Form.Control type='text'
            value={supplier.region}
            onChange={(e)=> setSupplier(prevState => ({...prevState, region: e.target.value}))}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Supplier Address</Form.Label>
          <Form.Control type='text'
            value={supplier.address}
            placeholder='location/ address'
            onChange={(e)=> setSupplier(prevState => ({...prevState, address: e.target.value}))}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Supplier TRN</Form.Label>
          <Form.Control type='text'
            value={supplier.trn}
            placeholder='Tax Registration Number'
            onChange={(e)=> setSupplier(prevState => ({...prevState, trn: e.target.value}))}
          />
        </Form.Group>
        <ButtonGroup className='mt-2 shadow-sm border'>
          <Button type='submit' variant='success'>SAVE</Button>
          <Button type='submit' variant='danger' onClick={(e)=>{
            e.preventDefault()
            setSupplier({})
          }}>CANCEL</Button>
        </ButtonGroup>
      </Form>
      </Container>
    </div>
  )
}
