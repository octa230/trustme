'use client'

import Calender from '@/app/components/Calender'
import DataTable from '@/app/components/DataTable'
import React from 'react'
import { InputGroup, Form, Col, Row, Card, Button, Accordion } from 'react-bootstrap'

export default function page() {
  return (
    <div>
      <h1>Enquiries</h1>
      <Row>
      <Card className='col-md-3'>
        <Card.Header>
          <Card.Title>Search Customer</Card.Title>
        </Card.Header>
        <InputGroup aria-describedby='addon' className='m-2'>
          <Form.Control type='text'/>
          <Button id='addon' variant='outline-secondary'>🔍</Button>
        </InputGroup>
      </Card>

      <Card className='col-md-3 mx-1'>
        <Accordion className='m-1'>
          <Accordion.Item eventKey='0'>
            <Accordion.Header>
                New Customer
            </Accordion.Header>
            <Accordion.Body>
                    <Form>
                      <Form.Group>
                        <Form.Label>Name</Form.Label>
                        <Form.Control type='text'
                        />
                      </Form.Group>
                      <Form.Group>
                        <Form.Label>Mobile</Form.Label>
                        <Form.Control type='text'
                        />
                      </Form.Group>
                      <Form.Group>
                        <Form.Label>Phone</Form.Label>
                        <Form.Control type='text'
                        />
                      </Form.Group>
                      <Form.Group>
                        <Form.Label>Email</Form.Label>
                        <Form.Control type='text'
                        />
                      </Form.Group>
                      <Form.Group>
                        <Form.Label>Emirate Region</Form.Label>
                        <Form.Control type='text'
                        />
                      </Form.Group>
                      <Form.Group>
                        <Form.Label>Address</Form.Label>
                        <Form.Control type='text'
                          placeholder='location/ address'
                        />
                      </Form.Group>
                      <Form.Group>
                        <Form.Label>Description</Form.Label>
                        <Form.Control type='text'
                          placeholder='Tax Registration Number'
                        />
                      </Form.Group>
                      <Button type='submit' className='mt-3'>SAVE</Button>
                    </Form>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </Card>
      <Card className='col-md-3 mx-1'>
        <Accordion className='m-1'>
          <Accordion.Item eventKey='1'>
            <Accordion.Header>
                Enquiry Details
            </Accordion.Header>
            <Accordion.Body>
                <Form>
                  <Form.Group>
                      <Form.Label>Enqury Number</Form.Label>
                        <Form.Control type='text' placeholder='101'/>
                      </Form.Group>
                      <Form.Group>
                        <Calender title='Expiry Date'/>
                      </Form.Group>
                      
                      
                      <Form.Group>
                        <Form.Label>TRN</Form.Label>
                        <Form.Control as='textarea' rows={5}
                          placeholder='Write something here'
                        />
                      </Form.Group>
                    <Button type='submit' className='mt-3'>SAVE</Button>
                  </Form>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </Card>

      <DataTable/>
      </Row>
    </div>
  )
}
