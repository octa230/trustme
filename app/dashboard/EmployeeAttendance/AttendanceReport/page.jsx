'use client'

import Calender from '@/app/components/Calender'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Col, Container, InputGroup, Row, Form, Button, Table, ButtonGroup } from 'react-bootstrap'


export default function AttendanceReportPage() {

  const [employees, setEmployees] = useState([])

  useEffect(() => {
    const getEmployees = async () => {
      const { data } = await axios.get('/api/employees')
      setEmployees(data)
      console.log(data)
    }
    getEmployees()
  }, [])


  return (
    <div>
      <Container fluid>
        <Row className="align-items-center bg-light border p-2 mb-2">
          <Col>
            <Calender title="FromDate" />
          </Col>
          <Col>
            <Calender title="EndDate" />
          </Col>
          <Col className='col-md-3'>
            <ButtonGroup>
              <Button variant='success'>SEARCH</Button>
              <Button variant='danger'>CLEAR</Button>
            </ButtonGroup>
          </Col>
          <Row className='my-2'>
        <Col className='col-md-9'>
            <InputGroup>
              <Form.Control type="text" placeholder="Employee controlId"/>
              <Button variant="outline-dark">🔍</Button>
            </InputGroup>
          </Col>
          <Col>
            <Button>Add Attendance</Button>
          </Col>
        </Row>
        </Row>
        

        <Table bordered>
          <thead>
            <tr>
              <th>#</th>
              <th>ctrlId</th>
              <th>Employee</th>
              <th>WorkStart Time</th>
              <th>WorkEnd Time</th>
              <th>Total WorkTime</th>
              <th>OT Start Time</th>
              <th>OT End Time</th>
              <th>Total OT</th>
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
          <tfoot>
            <tr>
              <th colSpan={5}>Totals</th>
              <td>0Hrs: 00Mins</td>
              <td></td>
              <td></td>
              <td>0Hrs: 00Mins</td>
            </tr>
          </tfoot>
        </Table>
      </Container>
    </div>
  )
}
