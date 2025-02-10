'use client'

import Calender from '@/app/components/Calender'
import React from 'react'
import { Card, Row, Container, Form, Button, InputGroup, Col } from 'react-bootstrap'

export default function page() {

  const status =['permanent', 'part-time', 'hybrid']
  const weeklyOffs = ['Sun','Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] 
  const departments = ['florist', 'driver']
  const shifts = ['Day', 'Night', 'Morning', 'Mid Morning', 'Mid-day', 'Evening']
  const jobPosts = ['jobA', 'jobB', 'jobC']
  const bloodGroups = ['A', 'A+', 'A', 'A-', 'B', 'B+', 'B', 'B-','O',  'O+', 'O',  'O-', 'AB', 'AB+', 'AB', 'AB-']

  
  return (
    <Container fluid className='w-100'>
      <h1>Add Employee</h1>
      <Row>
      <Card className='col-xs-12 col-md-4 m-3'>
        <Card.Header>
          <Card.Title>USER INFO</Card.Title>
          <Form>
            <Form.Group>
              <Form.Label>First Name</Form.Label>
              <Form.Control type='text'/>
            </Form.Group>
            <Form.Group>
              <Form.Label>Last Name</Form.Label>
              <Form.Control type='text'/>
            </Form.Group>
            <Form.Group>
              <Form.Label>Username</Form.Label>
              <Form.Control type='text'/>
            </Form.Group>
            <Form.Group>
              <Form.Label>Password</Form.Label>
              <Form.Control type='text'/>
            </Form.Group>
            <Form.Group>
              <Form.Label>Email</Form.Label>
              <Form.Control type='text'/>
            </Form.Group>
            <Form.Group>
              <Form.Label>Phone</Form.Label>
              <Form.Control type='text'/>
            </Form.Group>
            <Button type='Submit'>SAVE</Button>
          </Form>
        </Card.Header>
      </Card>
      <Card className='col-xs-12 col-md-4 m-3'>
        <Card.Header>
          <Card.Title>ADDRESS INFO</Card.Title>
          <Form>
            <Form.Group>
              <Form.Label>Street</Form.Label>
              <Form.Control type='text'/>
            </Form.Group>
            <Form.Group>
              <Form.Label>City</Form.Label>
              <Form.Control type='text'/>
            </Form.Group>
            <Form.Group>
              <Form.Label>State</Form.Label>
              <Form.Control type='text'/>
            </Form.Group>
            <Form.Group>
              <Form.Label>Zipcode</Form.Label>
              <Form.Control type='text'/>
            </Form.Group>
            <Form.Group>
              <Form.Label>Country</Form.Label>
              <Form.Control type='text'/>
            </Form.Group>
            <Button type='submit'>SAVE</Button>
          </Form>
        </Card.Header>
      </Card>
      <Card className='col-xs-12 col-md-4 m-3'>
        <Card.Header>
          <Card.Title>EMPLOYEE INFO</Card.Title>
          <Form>
            <Form.Group>
              <Form.Label>Joining Date</Form.Label>
              <Calender title='Joining Date'/>
              </Form.Group>
              <Form.Label>Leave Date</Form.Label>
              <Calender title='Leave Date'/>
              <Form.Group>
                <Form.Label>EmployeeId</Form.Label>
                <Form.Control type='text'/>
              </Form.Group>
              <Form.Group>
                <Form.Label>Employee Status</Form.Label>
                <Form.Select>
                  <option>---select---</option>
                  {status.map((stat, index)=>(
                    <option key={index}>{stat}</option>
                  ))}
                </Form.Select>
              </Form.Group>
              <Form.Group>
                <Form.Label>Department</Form.Label>
                <Form.Select>
                  <option>---select---</option>
                  {departments.map((dept, index)=>(
                    <option key={index}>{dept}</option>
                  ))}
                </Form.Select>
              </Form.Group>
              <Form.Group>
                <Form.Label>Shift</Form.Label>
                <Form.Select>
                  <option>---select---</option>
                  {shifts.map((shift, index)=>(
                    <option key={index}>{shift}</option>
                  ))}
                </Form.Select>
              </Form.Group>
              <Form.Group>
                <Form.Label>Weekly Off</Form.Label>
                <Form.Select>
                  <option>---select---</option>
                  {weeklyOffs.map((offDay, index)=>(
                    <option key={index}>{offDay}</option>
                  ))}
                </Form.Select>
              </Form.Group>
              <Form.Group>
                <Form.Label>Blood Group</Form.Label>
                <Form.Select>
                  <option>---select---</option>
                  {bloodGroups.map((group, index)=>(
                    <option key={index}>{group}</option>
                  ))}
                </Form.Select>
              </Form.Group>
          </Form>
        </Card.Header>
      </Card>
      <Card className='col-xs-12 col-md-4 m-3'>
        <Card.Header>
          <Card.Title>DISIGNATION & SALARY</Card.Title>
          <Form>
            <Form.Group>
              <Form.Label>Designation</Form.Label>
              <Form.Select>
                <option>---select---</option>
                {jobPosts.map((job, index)=> (
                  <option key={index}>{job}</option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group>
              <Form.Label>Start Date</Form.Label>
              <Calender title='Employment Start'/>
            </Form.Group>
            <Form.Group>
              <Form.Label>End Date</Form.Label>
              <Calender title='Employment End'/>
            </Form.Group>
            <Form.Group>
              <Form.Label>Salary</Form.Label>
              <Form.Control type='number'/>
            </Form.Group>
            <Form.Group>
              <Form.Label>Salary Comment</Form.Label>
              <Form.Control as="textarea" rows={5}/>
            </Form.Group>
          </Form>
        </Card.Header>
      </Card>
      <Row>
      <Form.Label>Supporting Documents</Form.Label>
      <Col className='my-2'>
      <InputGroup>
          <Form.Control type='text' aria-describedby='addon1' placeholder='name'/>
          <Form.Control type='text' aria-describedby='addon1' placeholder='document number/Id'/>
          <Button id='addon1' variant='outline-secondary'>Document</Button>
      </InputGroup>
      </Col>
      <Col>
        <Calender title='Expiry Date'/>
      </Col>
      </Row>
      </Row>
    </Container>
  )
}
