'use client'
import axios from 'axios'
import React, { useState } from 'react'
import { Button, Form, Container } from 'react-bootstrap'
import { toast } from 'react-toastify'

export default function page() {
  const [name, setName] = useState('')

  const handleSubmit =async(e)=>{
    e.preventDefault()

    toast.promise(
      axios.post(`/api/banks`, name),
      {
        pending: "...wait",
        success: 'Done',
        error: 'Oops, try again.'
      },
      {
        autoClose: 3000
      }
    )
    setName('')
  }


  return (
    <Container className='col-md-4'>
      <Form className='rounded shadow-sm border p-2' onSubmit={handleSubmit}>
        <h1>Add Cheque Banks</h1>
        <hr/>
        <Form.Group>
          <Form.Label>Bank Name</Form.Label>
          <Form.Control type='text'
            value={name}
            onChange={(e)=> setName(e.target.value)}
          />
        </Form.Group>
        <Button type='submit' className='mt-2' variant='success'>SAVE</Button>
      </Form>
    </Container>
  )
}
