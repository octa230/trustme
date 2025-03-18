'use client'


import DataTable from '@/app/components/DataTable'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { Row, Card, Col, InputGroup, Form, Button, Modal } from 'react-bootstrap'
import debounce from 'lodash.debounce'
import { useStore } from '@/app/Store'


const ReturnsPage =()=> {
  
  const[searchInvoiceNo, setSearchInvoiceNo] = useState('')
  const[searchPurhcaseNo, setSearchPurchaseNo] = useState('')
  const [customer, setCustomer] = useState({})
  const [supplier, setSupplier] = useState({})
  const [modalData, setModalData] = useState(null)
  
  
  
  const router = useRouter()
  const {state, dispatch: ctxDispacth} = useContext(useStore)

  const purchaseRef = useRef(null)
  const invoiceRef = useRef(null)

  const debounceSearch = useCallback(
    debounce(async (type, value) => {
      try {
        if (type === 'invoiceNo' && value) {
          const { data } = await axios.get(`/api/sales/invoice/search?searchKey=${value}`);
          setCustomer(data)
          setModalData(data)
          console.log('Invoice Search Result:', data);
        } else if (type === 'purchaseNo' && value) {
          const { data } = await axios.get(`/api/purchase/search?searchKey=${value}`);
          setSupplier(data)
          setModalData(data)
          console.log('Purchase Search Result:', data);
        }
      } catch (error) {
        console.error('Search error:', error.message);
      }
    }, 500), [] // 500ms debounce delay
  );



  const handleSearchChange = (type, value) => {
    if (type === 'invoiceNo') {
      setSearchInvoiceNo(value);
    } else if (type === 'purchaseNo') {
      setSearchPurchaseNo(value);
    }
    debounceSearch(type, value);
  };
  

  const handleConfirm = (e) => {
  e.preventDefault();

  if (window.confirm('Confirm Document?')) {
    if (modalData && modalData.customer) {
      //modalData.type = 'SALE'
      localStorage.removeItem('purchaseData')
      ctxDispacth({ type: 'SAVE_SALE', payload: {...modalData, type: "SALE"} });
      setCustomer(modalData); ///type used to save return type in db either SALE OR PURCHASE TYPE
    } else if (modalData.supplier) {
      localStorage.removeItem('saleData') ///REMOVE SALE DATA FROM SUBMITTED DATA
      //modalData.type = 'PURCHASE' ///type used to save return type in db either SALE OR PURCHASE TYPE
      ctxDispacth({ type: 'SAVE_PURCHASE', payload: {...modalData, type: "PURCHASE"} });
      setSupplier(modalData);
    } else {
      // Handle case where modalData is null or invalid
      console.error('Modal data is missing or invalid.');
    }
  }

  setModalData(null);  // Clear modal data after confirming
};

  

  return (
    <div>
      <h1>Returns</h1>
      <Row>
        <Col>
          <Card>
            <Card.Header className='d-flex justify-content-between'>
              <Card.Title className='text-danger'>Return From Customer</Card.Title>
              <Button variant='outline-dark' onClick={()=> router.push('./CustomerReturnList')}>☰</Button>
            </Card.Header>
            <InputGroup className='p-2' aria-describedby='addon'>
              <Form.Control type='text' 
                placeholder='invoice number'
                value={searchInvoiceNo || ''}
                onChange={(e)=>{
                  e.preventDefault()
                  handleSearchChange('invoiceNo', e.target.value)
                }}
                />
            </InputGroup>
          </Card>
        </Col>
        <Col>
          <Card>
            <Card.Header className='d-flex justify-content-between'>
              <Card.Title className='text-warning'>Return To Supplier</Card.Title>
              <Button variant='outline-dark' onClick={()=> router.push('./SupplierReturnList')}>☰</Button>
            </Card.Header>
            <InputGroup className='p-2' aria-describedby='addon'>
              <Form.Control type='text' 
                placeholder='purchase number'
                value={searchPurhcaseNo || ''}
                onChange={(e)=>{
                  e.preventDefault()
                  handleSearchChange('purchaseNo', e.target.value)
                }}
                />
            </InputGroup>
          </Card>
        </Col>
      </Row>
      <DataTable type={'return'}/>
        {modalData && (
          <Modal show={modalData && modalData.controlId} onHide={()=> setModalData(null)}>
          <Modal.Header closeButton> ControlId: {modalData?.controlId}</Modal.Header>
          <Modal.Body>
            <p className='border-bottom'><strong>Document Number: </strong>{modalData.invoiceNo || modalData.purchaseNo}</p>
            <p className='border-bottom'><strong>CreatedOn: </strong>{new Date(modalData.createdAt).toDateString()}</p>
            <p className='border-bottom'><strong>customerName: </strong>{modalData.customerName || modalData.supplierName}</p>
            <p className='border-bottom'><strong>customerId: </strong>{modalData.customerId || modalData.supplierId}</p>
            <p className='border-bottom'><strong>itemsTotal: </strong>{modalData.itemsTotal}</p>
            <p className='border-bottom'><strong>discount: </strong>{modalData.discount}</p>
            <p className='border-bottom'><strong>discountAmount: </strong>{modalData.discountAmount}</p>
            <p className='border-bottom'><strong>totalAfterDiscount: </strong>{modalData.totalAfterDiscount}</p>
            <p className='border-bottom'><strong>vatRate: </strong>{modalData.vatRate}</p>
            <p className='border-bottom'><strong>itemsWithoutVat: </strong>{modalData.itemsWithoutVat}</p>
            <p className='border-bottom'><strong>vatAmount: </strong>{modalData.vatAmount}</p>
            <p className='border-bottom'><strong>paidAmount: </strong>{modalData.paidAmount}</p>
            <p className='border-bottom'><strong>pendingAmount: </strong>{modalData.pendingAmount}</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant='dark text-success' onClick={handleConfirm}>CONFRIM👍</Button>
          </Modal.Footer>
        </Modal>
        )}
    </div>
  )
}


export default ReturnsPage