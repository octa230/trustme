'use client'

import React, {useState} from 'react'
import { Button, Form, InputGroup,Card, Container } from 'react-bootstrap'
import Calender from '@/app/components/Calender'


const page = () => {
  const [selectedPaymentMthd, setSelectedPaymentMthd] = useState('')


  const handlePaymentChange =(e)=>{
    setSelectedPaymentMthd(e.target.value)
  }








  return (
    <Container fluid className='col-md-5' style={{height: '100vh'}}>
      <Card className='p-2 d-flex justify-content-center'>
        <Card.Header>
          <Card.Title>New Expense</Card.Title>
        </Card.Header>
        <Form.Group>
          <Form.Group>
            <Calender title='Date'/>
          </Form.Group>
          <Form.Group>
            <Form.Label>Recipt Number / Id</Form.Label>
            <Form.Control type='text'/>
          </Form.Group>
          <Form.Group>
            <Form.Label>Expense Name</Form.Label>
            <Form.Select>
              <option>---select---</option>
              {['petrol', 'computer', 'services'].map((item, index)=>(
                <option key={index}>{item}</option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group>
            <Form.Label>Expense Amount</Form.Label>
            <Form.Control type='number'/>
          </Form.Group>
          <Form.Group>
            <Form.Label>Expense Vat</Form.Label>
            <Form.Control type='number'/>
          </Form.Group>
          <Form.Group>
            <Form.Label>Total Expense</Form.Label>
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
        <Button variant='danger' className='m-3'>CANCEL</Button>
        </div>
      </Card>
    </Container>
  )
}

export default page
