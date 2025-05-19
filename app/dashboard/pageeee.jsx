'use client'


import React, { useState } from 'react'
import { Col, Row, Container, Button, Accordion, ListGroup} from 'react-bootstrap'
import Nav  from 'react-bootstrap/esm/Nav'
import Navbar  from 'react-bootstrap/esm/Navbar'

const Page = () => {

  const show = true
  return (
      <Container fluid className="p-0">
        <Row className="g-0">
          <Col className="p-3">
            {/* Main content area */}
            <div className={show ? 'ms-[280px]' : ''} style={{ transition: 'margin 0.3s' }}>
              screen content here
            </div>
          </Col>
        </Row>
      </Container>
  )
}

export default Page
