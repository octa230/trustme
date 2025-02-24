'use client'

import React from 'react'
import 'chart.js/auto'
import { Card, Col, Container, Row } from 'react-bootstrap'
import RevenueChart from '@/app/components/RevenueChart';
import PendingsChart from '@/app/components/PendingsChart';

const page = () => {


  return (
    <Container>
      <Row className='border p-3 bg-light'>
        <Col>
          <Card className='p-1'>
            <Card.Title>CUSTOMERS</Card.Title>
            <Card.Img src='/images/customer.png' style={imgStyle}/>
            <Card.Body>
              <Card.Text>
                <strong>420k⌃</strong>
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card className='p-1'>
            <Card.Title>SUPPLIERS</Card.Title>
            <Card.Img src='/images/supplier.png' style={imgStyle}/>
            <Card.Body>
              <Card.Text>
                <strong>200⌃</strong>
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card className='p-1'>
            <Card.Title>TOTAL SALES</Card.Title>
            <Card.Img src='/images/sale.png' style={imgStyle}/>
            <Card.Body>
              <Card.Text>
                <strong>20000⌃</strong>
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card className='p-1'>
            <Card.Title>TOTAL PURCHASES</Card.Title>
            <Card.Img src='/images/purchase.png' style={imgStyle}/>
            <Card.Body>
              <Card.Text>
                <strong>790⌃</strong>
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row className='my-3 border'>
        <RevenueChart/>
        <PendingsChart/>
      </Row>
    </Container>
  )
}


const imgStyle ={
  height: 50,
  width: 50,
  objectFit: 'contain',
  position: "absolute",
  bottom: 2,
  right: 4
}



export default page
