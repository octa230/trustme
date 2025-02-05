'use client'


import React, {useState} from 'react'
import { MdSpaceDashboard } from "react-icons/md";
import { Container, Row, Col, Button, Navbar, Offcanvas, ListGroup, Accordion, Nav} from 'react-bootstrap'

const DashboardLayout = ({children, sidebar, modal, content}) => {

  const [show, setShow] = useState(true)

  const toggle =()=> setShow(!show)

  const menu = [
      {
        title:"Dashboard",
        icon: <MdSpaceDashboard/>,
        links:[]
      },
      {
        title:"Enquiry",
        icon: <MdSpaceDashboard/>,
        links:[ 
          {name:"Enquiries", href:"" },
          {name:"Enquiries List", href:"" }
      ]
      },
      {
        title:"Quotations",
        icon: <MdSpaceDashboard/>,
        links:[
          { name:"Quotations", href:""}, 
          { name:"Quotations From Enqury", href: ""},
          { name:"Quotations List", href: ""}
        ]
      },
      {
        title:"Sales",
        icon: <MdSpaceDashboard/>,
        links:[
          { name:"Sales", href:""},
          { name:"Sales List", href:""}
      ]
      },
      {
        title:"Cheque",
        icon: <MdSpaceDashboard/>,
        links:[
          { name:"Add Check Banks", href:""},
          { name:"Banks List", href:""},
          { name:"Invoice Cheque List", href:""},
          { name:"Purchase Cheque List", href:""},
  
        ]
      },
      {
        title:"Purchase",
        icon: <MdSpaceDashboard/>,
        links:[
          {name:"purchase", href:""},
          {name:"purchase List", href:""},
        ]
      },
      {
        title:"Employee",
        icon: <MdSpaceDashboard/>,
        links:[ 
          {name:"Add Employee", href:""},
          {name:"Employee List", href:""},
        ]
      },
      {
        title:"Employee Attendance",
        icon: <MdSpaceDashboard/>,
        links:[
          {name:"Record Daily Attendance", href:""},
          {name:"Attendance Report", href:""},
          {name:"Record Employee Leave", href:""},
          {name:"Leave Report", href:""},
        ]
      },
      {
        title:"Customer",
        icon: <MdSpaceDashboard/>,
        links:[ 
          {name:"Add Customer", href:""},
          {name:"Customer List", href:""},
          {name:"Leads List", href:""},
          {name:"Customer Advance", href:""},
          {name:"Customer Ledger", href:""},
        ]
      },
      {
        title:"Supplier",
        icon: <MdSpaceDashboard/>,
        links:[
          { name:"Add Supplier", href:""},
          { name:"Supplier List", href:""},
          { name:"Supplier Advance", href:""},
          { name:"Supplier Ledger", href:""},
        ]
      },
      {
        title:"Returns",
        icon: <MdSpaceDashboard/>,
        links:[ 
          {name:"Returns", href:""},
          {name:"Customer Return List", href:""},
          {name:"Supplier Return List", href:""},
        ]
      },
      {
        title:"Master",
        icon: <MdSpaceDashboard/>,
        links:[
          {name:"Item List", href:""},
          {name:"Unit List", href:""},
          {name:"Category List", href:""},
          {name:"Ledger", href:""},
        ]
      },
      {
        title:"Accounts",
        icon: <MdSpaceDashboard/>,
        links:[ 
          {name:"Profit and Loss", href:""},
          {name:"Trading And Profit And Loss", href:""},
          {name:"Balance Sheet", href:""},
          {name:"Trial Balance Sheet", href:""},
          {name:"Customer Service", href:""},
          {name:"Supplier Payment", href:""},
          {name:"Bank Transactions", href:""},
          {name:"Add Expenses", href:""},
        ]
      },
      {
        title:"Stock Rport",
        icon: <MdSpaceDashboard/>,
        links:[
          {name:"Report", href:""},
        ]
      },
      {
        title:"Purchase Report",
        icon: <MdSpaceDashboard/>,
        links:[
          { name:"Item Purchase Report", href:""},
        ]
      },
      {
        title:"Reports",
        icon: <MdSpaceDashboard/>,
        links:[
          {name:"Customer Ledger", href:""},
          {name:"Customer Advance Ledger", href:""},
          {name:"Supplier Ledger", href:""},
          {name:"Supplier Advance Ledger", href:""},
          {name:"Cash Ledger", href:""},
          {name:"Bank Ledger", href:""},
          {name:"Card Ledger", href:""},
          {name:"Vat Ledger", href:""},
          {name:"Sales Vat Ledger", href:""},
          {name:"Purchase Vat Ledger", href:""},
          {name:"Expense Vat Ledger", href:""},
          {name:"Customer Recieve Ledger", href:""},
          {name:"Supplier Payment List", href:""},
          {name:"Company Expenses List", href:""},
          {name:"Daily Report", href:""},
          {name:"Sales & Purchase Report", href:""},
          {name:"User Wise Sales Report", href:""},
          {name:"Product Sale Report", href:""},
          {name:"Product Purchase Report", href:""},
          {name:"Product Sale Return Report", href:""},
          {name:"Product purchase Return Report", href:""},
          {name:"Docs Expiry List", href:""},
        ]
      },
      {
        title:"Admin",
        icon: <MdSpaceDashboard/>,
        links:[
          {name:"Manage Users", href:""},
          {name:"Add Bank Accounts", href:""},
          {name:"Manage Company", href:""},
        ]
      },
      
    ]

  return (
    <div className="min-h-screen">
      <Navbar bg="light" data-bs-theme="light" className="border-bottom fixed-top">
        <Container fluid>
          <Navbar.Brand>
            <Button variant="outline-primary" onClick={toggle}>
              ☰
            </Button>
          </Navbar.Brand>
        </Container>
      </Navbar>

      <aside>
        <Offcanvas
          show={show}
          onHide={toggle}
          scroll={true}
          backdrop={false}
          placement="start"
          style={{ marginTop: '70px', width: '280px' }}
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Dashboard</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <ListGroup variant="flush">
              {menu.map((item, index) => (
                <Accordion defaultActiveKey={index} flush key={index}>
                  <Accordion.Item eventKey="0">
                    <Accordion.Header>{item.title}</Accordion.Header>
                    <Accordion.Body>
                      {item.links?.map((link, linkIndex) => (
                        <ListGroup.Item className="my-2" key={linkIndex}>
                          <Nav.Item 
                            onClick={() => {
                              console.log(link.name);
                              toggle();
                            }}
                            style={{ cursor: 'pointer' }}
                          >
                            {link.name}
                          </Nav.Item>
                        </ListGroup.Item>
                      ))}
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>
              ))}
            </ListGroup>
          </Offcanvas.Body>
        </Offcanvas>
      </aside>
      <Container fluid className="p-0" style={{ marginTop: '70px' }}>
        <Row className="g-0">
          <Col className="p-3">
            {content || children}
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default DashboardLayout
