"use client"

import axios from 'axios'
import React, { useState } from 'react'
import { Button, Form, Container, ButtonGroup } from 'react-bootstrap'
import { toast } from 'react-toastify'

export default function Page() {

  const [customer, setCustomer] = useState({
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
      axios.post(`/api/customers`, customer),
      {
        pending: '...wait',
        success: 'Done',
        error: "Oops, try again!"
      },
      {
        autoClose: 3000
      }
    )

    setCustomer({})
    
  }
  return (
    <Container className='col-md-5'>
      <Form className='justify-content-center border p-2 rounded shadow-sm' onSubmit={handleSubmit}>
        <h1 className='text-muted'>Add Customer</h1>
        <hr/>
        <Form.Group>
          <Form.Label>Name</Form.Label>
          <Form.Control type='text'
            value={customer.name}
            onChange={(e)=> setCustomer(prevState => ({...prevState, name: e.target.value}))}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Mobile</Form.Label>
          <Form.Control type='text'
            value={customer.mobile}
            onChange={(e)=> setCustomer(prevState => ({...prevState, mobile: e.target.value}))}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Phone</Form.Label>
          <Form.Control type='text'
            value={customer.phone}
            onChange={(e)=> setCustomer(prevState => ({...prevState, phone: e.target.value}))}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Email</Form.Label>
          <Form.Control type='email'
            value={customer.email}
            onChange={(e)=> setCustomer(prevState => ({...prevState, email: e.target.value}))}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Emirate Region</Form.Label>
          <Form.Control type='text'
            value={customer.region}
            onChange={(e)=> setCustomer(prevState => ({...prevState, region: e.target.value}))}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Address</Form.Label>
          <Form.Control type='text'
            placeholder='location/ address'
            value={customer.address}
            onChange={(e)=> setCustomer(prevState => ({...prevState, address: e.target.value}))}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>TRN</Form.Label>
          <Form.Control type='text'
            maxLength={15}
            minLength={15}
            placeholder='Tax Registration Number'
            value={customer.trn}
            onChange={(e)=> setCustomer(prevState => ({...prevState, trn: e.target.value}))}
          />
        </Form.Group>
        <ButtonGroup className='mt-3'>
          <Button type='submit' variant='success'>SAVE</Button>
          <Button type='submit' variant='danger' onClick={(e)=>{
            if(window.confirm('clear form data?')){
              setCustomer({})
            }
          }}>CANCEL</Button>
        </ButtonGroup>
      </Form>
    </Container>
  )
}
