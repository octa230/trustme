'use client'

import Calender from '@/app/components/Calender'
import React from 'react'
import { Card, Row, Container, Form, Button, InputGroup, Col, ButtonGroup } from 'react-bootstrap'

export default function page() {

  const status =['permanent', 'part-time', 'hybrid']
  const weeklyOffs = ['Sun','Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] 
  const departments = ['florist', 'driver']
  const shifts = ['Day', 'Night', 'Morning', 'Mid Morning', 'Mid-day', 'Evening']
  const jobPosts = ['jobA', 'jobB', 'jobC']
  const bloodGroups = ['A', 'A+', 'A', 'A-', 'B', 'B+', 'B', 'B-','O',  'O+', 'O',  'O-', 'AB', 'AB+', 'AB', 'AB-']

  
  return (
    <Container fluid>
      <Form className='d-flex justify-content-center flex-wrap'>
        <div className='col-md-5 p-2 border rounded shadow-sm m-2'>
            <h1 className='text-muted'>USER INFO</h1>
            <hr/>
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
        </div>
        <div className='col-md-5 p-2 border rounded shadow-sm m-2'>
            <h1 className='text-muted'>ADDRESS INFO</h1>
            <hr/>
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
          </div>
          <div className='col-md-5 p-2 border rounded shadow-sm m-2'>
            <h1 className='text-muted'>EMPLOYEE INFO</h1>
            <hr/>
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
        </div>
        <div className='col-md-5 p-2 border rounded shadow-sm m-2'>
            <h1 className='text-muted'>DISIGNATION & SALARY</h1>
            <hr/>
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
        </div>
        <div className='my-2 col-md-8'>
        <InputGroup>
          <Form.Control type='text' aria-describedby='addon1' placeholder='name'/>
          <Form.Control type='text' aria-describedby='addon1' placeholder='document number/Id'/>
          <Button id='addon1' variant='outline-secondary'>Document</Button>
        </InputGroup>
        <Calender title='Expiry Date'/>
      </div>
        <div className='col-md-5'>
          <ButtonGroup>
            <Button variant='success'>SAVE</Button>
            <Button variant='danger'>CANCEL</Button>
          </ButtonGroup>
          </div>
      </Form>
    </Container>
  )
}
