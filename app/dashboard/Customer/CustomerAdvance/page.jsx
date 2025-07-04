'use client'

import React, {useState, useEffect, use} from 'react'
import { Button, Form, InputGroup, Container } from 'react-bootstrap'
import Calender from '@/app/components/Calender'
import axios from 'axios'


export default function page() {

   const [selectedPaymentMthd, setSelectedPaymentMthd] = useState('')
   const [customers, setCustomers] = useState([])
  
    const handlePaymentChange =(e)=>{
      setSelectedPaymentMthd(e.target.value)
    }

    useEffect(()=>{
      const fetchCustomers = async()=>{
        try{
          const {data} = await axios.get(`/api/customers/`)
          setCustomers(data)
          console.log(data)
        }catch(error){
          console.error("Error fetching customers:", error)
        }
      }
      fetchCustomers()
    }, [])
    

  return (
    <Container fluid className='col-md-5'>
      <Form className='p-2 justify-content-center border rounded shadow-sm'>
        <h1 className='text-muted'>Customer Advance</h1>
        <hr/>
        <Form.Group>
          <Form.Group>
            <Calender title='Date'/>
          </Form.Group>
          <Form.Group>
            <Form.Label>Recipt Number / Id</Form.Label>
            <Form.Control type='text'/>
          </Form.Group>
          <Form.Group>
            <Form.Label>Customer Name</Form.Label>
            <Form.Select>
              <option>---select---</option>
              {customers.map((item, index)=>(
                <option key={index}>{item.name}</option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group>
            <Form.Label>Amount</Form.Label>
            <Form.Control type='number'/>
          </Form.Group>
          <Form.Group>
            {['cash', 'card', 'bank'].map((item, index)=>(
              <Form.Check 
              label={item} 
              key={index} 
              type='radio'
              value={item}
              checked={selectedPaymentMthd === item}
              onChange={handlePaymentChange}
              />
            ))}
          </Form.Group>
          {selectedPaymentMthd === 'bank' && (
            <Form.Group className='mb-3'>
              <Form.Label>Bank Name</Form.Label>
              <Form.Select>
                <option>---select---</option>
                {['bankA', 'bankB', 'bankC'].map((bank, index)=>(
                  <option key={index}>{bank}</option>
                ))}
              </Form.Select>
            </Form.Group>
          )}
          <Form.Group>
            <InputGroup>
              <Form.Control type='text' id='addon1'/>
              <Button aria-describedby='addon1' variant='outline-secondary'>upload file</Button>
            </InputGroup>
          </Form.Group>
          <Form.Group>
            <Form.Label>Notes</Form.Label>
            <Form.Control as='textarea' rows={5} type='text' placeholder='write something here'/>
          </Form.Group>
        </Form.Group>
        <div className='d-flex align-self-end p-2'>
        <Button type='submit' className='m-3'>SAVE</Button>
        <Button variant='success' type='submit' className='m-3'>SAVE & PRINT</Button>
        <Button variant='danger' className='m-3'>CANCEL</Button>
        </div>
      </Form>
    </Container>
  )
}
