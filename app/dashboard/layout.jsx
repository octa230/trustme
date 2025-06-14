'use client'

import React, {useContext, useState} from 'react'
import { MdSpaceDashboard } from "react-icons/md";
import { Container, Row, Col, Button, Navbar, Offcanvas, ListGroup, Accordion, Nav, ButtonGroup, Badge} from 'react-bootstrap'
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useStore } from '../Store';
import axios from 'axios';
import { toast } from 'react-toastify';

const DashboardLayout = ({children}) => {

  const [show, setShow] = useState(true)
  
  const {state, dispatch: ctxDispatch} = useContext(useStore)
  
  const toggle =()=> setShow(!show)

  const getData =()=>{
    console.log('data')
  }

  const router = useRouter()

  const logOutUser =()=>{
    ctxDispatch({type: 'LOG_OUT'})
    localStorage.removeItem('userData')
    router.replace('/')
  }


const printLetterHead = async (e) => {
  // Function to print the letter head
  e.preventDefault()
  window.confirm('print Company Letter Head?') &&
  toast.promise(
    axios.post(`/api/print/letterhead`, {}, {responseType: "blob"})
    .then(response => {
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      window.open(url, "_blank");
    }),
    {
      pending: 'Printing...',
      success: 'Letter head printed!',
      error: 'Failed to print letter head'
    }
  );
}

  const menu = [
      {
        title:"Dashboard",
        icon: <MdSpaceDashboard/>,
        links:[{name:"Overview", href:"/"}]
      },
      {
        title:"Enquiry",
        icon: <MdSpaceDashboard/>,
        links:[ 
          {name:"Enquiries", href:"/dashboard/Enquiry/Enquiries" },
          {name:"Enquiries List", href:"/dashboard/Enquiry/EnquiriesList" }
      ]
      },
      {
        title:"Delivery Note",
        icon: <MdSpaceDashboard/>,
        links:[ 
          {name:"Delivery Note", href:"/dashboard/DeliveryNote" },
          {name:"Delivery Notes List", href:"/dashboard/DeliveryNote/DeliveryNoteList" }
      ]
      },
      {
        title:"Quotations",
        icon: <MdSpaceDashboard/>,
        links:[
          { name:"Quotations", href:"/dashboard/Quotation/Quotations"}, 
          { name:"Quotations From Enqury", href: "/dashboard/Quotation/EnquiryQuotations"},
          { name:"Quotations List", href: "/dashboard/Quotation/QuotationsList"}
        ]
      },
      {
        title:"Sales",
        icon: <MdSpaceDashboard/>,
        links:[
          { name:"Sales", href:  "/dashboard/Sales"},
          { name:"Sales List", href:  "/dashboard/Sales/SalesList"}
      ]
      },
      {
        title:"Cheque",
        icon: <MdSpaceDashboard/>,
        links:[
          { name:"Add Check Banks", href:"/dashboard/Cheque/AddChequeBanks"},
          { name:"Banks List", href:"/dashboard/Cheque/BanksList"},
          { name:"Invoice Cheque List", href:"/dashboard/Cheque/InvoiceChequeList"},
          { name:"Purchase Cheque List", href:"/dashboard/Cheque/PurchaseChequeList"},
  
        ]
      },
      {
        title:"Purchase",
        icon: <MdSpaceDashboard/>,
        links:[
          {name:"purchase", href:"/dashboard/Purchase/Purchase"},
          {name:"purchase List", href:"/dashboard/Purchase/PurchaseList"},
        ]
      },
      {
        title:"Employee",
        icon: <MdSpaceDashboard/>,
        links:[ 
          {name:"Add Employee", href:"/dashboard/Employee/AddEmployee"},
          {name:"Employee List", href:"/dashboard/Employee/EmployeeList"},
        ]
      },
      {
        title:"Employee Attendance",
        icon: <MdSpaceDashboard/>,
        links:[
          {name:"Record Daily Attendance", href:"/dashboard/EmployeeAttendance/RecordDaliyAttendance"},
          {name:"Attendance Report", href:"/dashboard/EmployeeAttendance/AttendanceReport"},
          {name:"Record Employee Leave", href:"/dashboard/EmployeeAttendance/EmployeeLeave"},
          {name:"Leave Report", href:"/dashboard/EmployeeAttendance/LeaveReport"},
        ]
      },
      {
        title:"Customer",
        icon: <MdSpaceDashboard/>,
        links:[ 
          {name:"Add Customer", href:"/dashboard/Customer/AddCustomer"},
          {name:"Customer List", href:"/dashboard/Customer/CustomerList"},
          {name:"Leads List", href:"/dashboard/Customer/LeadsList"},
          {name:"Customer Advance", href:"/dashboard/Customer/CustomerAdvance"},
          {name:"Customer Ledger", href:"/dashboard/Customer/CustomerLedger"},
        ]
      },
      {
        title:"Supplier",
        icon: <MdSpaceDashboard/>,
        links:[
          { name:"Add Supplier", href:"/dashboard/Supplier/AddSupplier"},
          { name:"Supplier List", href:"/dashboard/Supplier/SupplierList"},
          { name:"Supplier Advance", href:"/dashboard/Supplier/SupplierAdvance"},
          { name:"Supplier Ledger", href:"/dashboard/Supplier/SupplierLedger"},
        ]
      },
      {
        title:"Returns",
        icon: <MdSpaceDashboard/>,
        links:[ 
          {name:"Returns", href:"/dashboard/Returns/Returns"},
          {name:"Customer Return List", href:"/dashboard/Returns/CustomerReturnList"},
          {name:"Supplier Return List", href:"/dashboard/Returns/SupplierReturnList"},
        ]
      },
      {
        title:"Master",
        icon: <MdSpaceDashboard/>,
        links:[
          {name:"Item List", href:"/dashboard/Master/ItemsList"},
          {name:"Unit List", href:"/dashboard/Master/UnitsList"},
          {name:"Category List", href:"/dashboard/Master/CategoryList"},
          {name:"Ledger", href:"/dashboard/Master/Ledger"},
        ]
      },
      {
        title:"Account",
        icon: <MdSpaceDashboard/>,
        links:[ 
          {name:"Profit and Loss", href:"/dashboard/Account/ProfitAndLoss"},
          {name:"Trading And Profit And Loss", href:"/dashboard/Account/TradingProfitAndLoss"},
          {name:"Balance Sheet", href:"/dashboard/Account/BalanceSheet"},
          {name:"Trial Balance Sheet", href:"/dashboard/Account/TrialBalanceReport"},
          {name:"Customer Recive", href:"/dashboard/Account/CustomerRecieve"},
          {name:"Supplier Payment", href:"/dashboard/Account/SupplierPayment"},
          {name:"Bank Transactions", href:"/dashboard/Account/BankTransactions"},
          {name:"Add Expenses", href:"/dashboard/Account/AddExpenses"},
        ]
      },
      {
        title:"Stock Rport",
        icon: <MdSpaceDashboard/>,
        links:[
          {name:"Report", href:"/dashboard/StockReport/Report"},
        ]
      },
      {
        title:"Purchase Report",
        icon: <MdSpaceDashboard/>,
        links:[
          { name:"Item Purchase Report", href:"/dashboard/PurchaseReport/ItemPurchaseReport"},
        ]
      },
      {
        title:"Reports",
        icon: <MdSpaceDashboard/>,
        links:[
          {name:"Customer Ledger", href:"/dashboard/Reports/CustomerLedger"},
          {name:"Customer Advance Ledger", href:"/dashboard/Reports/CustomerAdvanceLedger"},
          {name:"Supplier Ledger", href:"/dashboard/Reports/SupplierLedger"},
          {name:"Supplier Advance Ledger", href:"/dashboard/Reports/SupplierAdvanceLedger"},
          {name:"Cash Ledger", href:"/dashboard/Reports/CashLedger"},
          {name:"Bank Ledger", href:"/dashboard/Reports/BankLedger"},
          {name:"Card Ledger", href:"/dashboard/Reports/CardLedger"},
          {name:"Vat Ledger", href:"/dashboard/Reports/VatLedger"},
          {name:"Sales Vat Ledger", href:"/dashboard/Reports/SalesVatLedger"},
          {name:"Purchase Vat Ledger", href:"/dashboard/Reports/PurchaseVatLedger"},
          {name:"Expense Vat Ledger", href:"/dashboard/Reports/ExpenseVatLedger"},
          {name:"Customer Recieve List", href:"/dashboard/Reports/CustomerRecieveList"},
          {name:"Supplier Payment List", href:"/dashboard/Reports/SupplierPaymentList"},
          {name:"Company Expenses List", href:"/dashboard/Reports/CompanyExpenseList"},
          {name:"Daily Report", href:"/dashboard/Reports/DailyReport"},
          {name:"Sales & Purchase Report", href:"/dashboard/Reports/SalesAndPurchaseReport"},
          {name:"User Wise Sales Report", href:"/dashboard/Reports/UserSalesReport"},
          {name:"Product Sale Report", href:"/dashboard/Reports/SaleReportProductWise"},
          {name:"Product Purchase Report", href:"/dashboard/Reports/PurchaseReportProductWise"},
          {name:"Product Sale Return Report", href:"/dashboard/Reports/SaleReturnReportProduct"},
          {name:"Product purchase Return Report", href:"/dashboard/Reports/PurchaseReturnReportProduct"},
          {name:"Docs Expiry List", href:"/dashboard/Reports/DocsExpiryList"},
        ]
      },
      {
        title:"Admin",
        icon: <MdSpaceDashboard/>,
        links:[
          {name:"Manage Users", href:"/dashboard/Admin/ManageUsers"},
          {name:"Add Bank Accounts", href:"/dashboard/Admin/AddBankAccount"},
          {name:"Manage Company", href:"/dashboard/Admin/ManageCompany"},
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
          <ButtonGroup className='border rounded shadow-sm'>
            <Button variant='light border border-dark' onClick={printLetterHead}>
              📄 Letter
            </Button>
            <Button variant='light border border-dark'>
              ✉️ <Badge pill className='bg-info'>9</Badge>
              <span className='visually-hidden'>Notifications</span>
            </Button>
          <Button variant='outline-danger' onClick={logOutUser}>
              ⏏️ Logout
          </Button>
          </ButtonGroup>
        </Container>
      </Navbar>

      <aside>
        <Offcanvas 
          show={show}
          onHide={toggle}
          scroll={true}
          backdrop={false}
          placement="start"
          style={{ marginTop: '70px', width: '280px'}}
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
                    <Accordion.Body className='p-1'>
                      {item.links?.map((link, linkIndex) => (
                        <ListGroup.Item className="py-2 px-1 border-none" key={linkIndex}>
                          <Link href={link.href} passHref
                            onClick={() => {
                              //console.log(link.name);
                              toggle();
                            }}
                            style={{ cursor: 'pointer' }}>
                            {link.name}
                          </Link>
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
            {children}
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default DashboardLayout
