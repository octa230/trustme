'use client'

import Calender from '@/app/components/Calender'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Col, Container, InputGroup, Row, Form, Button, Table, ButtonGroup } from 'react-bootstrap'

export default function RecordDailyPage() {
  const [employees, setEmployees] = useState([])

  useEffect(() => {
    const getEmployees = async () => {
      const { data } = await axios.get('/api/employees')
      setEmployees(data)
      console.log(data)
    }
    getEmployees()
  }, [])

  // Handle time and attendance changes
  const handleInputChange = (index, field, value) => {
    const updatedEmployees = [...employees]
    updatedEmployees[index][field] = value
    setEmployees(updatedEmployees)
  }

  return (
    <div>
      <Container fluid>
        <Row className="align-items-center">
          <Col>
            <InputGroup>
              <Form.Control type="text" placeholder="Employee controlId" />
              <Button variant="outline-dark">🔍</Button>
            </InputGroup>
          </Col>
          <Col>
            <Calender title="Date" />
          </Col>
        </Row>

        <Table bordered>
          <thead>
            <tr>
              <th>#</th>
              <th>ctrlId</th>
              <th>Employee</th>
              <th>Start Time</th>
              <th>End Time</th>
              <th>Total Time</th>
              <th>OT Start Time</th>
              <th>OT End Time</th>
              <th>OT Hours</th>
              <th>Attendance</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee, index) => (
              <tr key={index}>
                <td>
                  {index+1}
                </td>
                <td>
                  {employee.controlId}
                </td>
                <td>
                  <Form.Control
                    type="text"
                    value={employee.userDetails.username || ''}
                    onChange={(e) => handleInputChange(index, 'username', e.target.value)}
                    disabled
                  />
                </td>
                <td>
                  <Form.Control
                    type="time"
                    value={employee.startTime || ''}
                    onChange={(e) => handleInputChange(index, 'startTime', e.target.value)}
                  />
                </td>
                <td>
                  <Form.Control
                    type="time"
                    value={employee.endTime || ''}
                    onChange={(e) => handleInputChange(index, 'endTime', e.target.value)}
                  />
                </td>
                <td>
                  <Form.Control
                    type="time"
                    value={employee.startTime || ''}
                    onChange={(e) => handleInputChange(index, 'TotalTime', e.target.value)}
                  />
                </td>
                <td>
                  <Form.Control
                    type="time"
                    value={employee.overTimeStart || ''}
                    onChange={(e) => handleInputChange(index, 'overTimeStart', e.target.value)}
                  />
                </td>
                <td>
                  <Form.Control
                    type="time"
                    value={employee.overTimeEnd || ''}
                    onChange={(e) => handleInputChange(index, 'overTimeEnd', e.target.value)}
                  />
                </td>
                <td>
                  <Form.Control
                    type="time"
                    value={employee.overTimeHours || ''}
                    onChange={(e) => handleInputChange(index, 'overTimeHours', e.target.value)}
                  />
                </td>
                <td>
                  <Form.Check
                    checked={employee.Attendance || false}
                    onChange={(e) => handleInputChange(index, 'Attendance', e.target.checked)}
                    size={22}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <Row className='d-flex justify-content-center my-3'>
          <ButtonGroup className='w-25'>
            <Button variant='success'>SAVE</Button>
            <Button variant='danger'>CANCEL</Button>
          </ButtonGroup>
        </Row>
      </Container>
    </div>
  )
}
