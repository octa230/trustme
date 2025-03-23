'use client'

import React, {useEffect, useState} from 'react'
import { Button, Form, InputGroup, Container, Dropdown, ListGroup } from 'react-bootstrap'
import Calender from '@/app/components/Calender'
import axios from 'axios'


export default function page() {

  const [banks, setBanks] = useState([])
  const [suppliers, setSuppliers] = useState([])
  const [supplier, setSupplier] = useState(null)
  const [filteredSuppliers, setFilteredsuppliers ] = useState([])
  const [advanceData, setAdvanceData ] = useState({
    receiptNumber: '',
    bankName: '',
    paymentMethod:"",
    supplier: null,
    description:""
  })
  const [searchKey, setSearchKey] = useState('')
  const [selectedPaymentMthd, setSelectedPaymentMthd] = useState('')

  console.log(supplier)


  const getData = async()=>{
    const [banksRes, suppliersRes] = await Promise.all([
      axios.get(`/api/banks`),
      axios.get(`/api/supplier`)
    ])
    setBanks(banksRes.data)
    setSuppliers(suppliersRes.data)
    
  }
    
  useEffect(()=>{
    getData()
  },[])

  const handlePaymentChange =(e)=>{
    setSelectedPaymentMthd(e.target.value)
  }


  const supplierSearch=(value)=>{
    setSearchKey(value)
    const res = suppliers.filter((supplier)=> 
      supplier.name.toLowerCase().includes(value.toLowerCase()) 
    )
    setFilteredsuppliers(res)
  }


  return (
    <Container className='col-md-5'>
      <Form className='p-2 border rounded shadow-sm'>
        <h1>Supplier Advance</h1>
          <hr/>
        <Form.Group>
          <Form.Group>
            <Calender title='Date'/>
          </Form.Group>
          <Form.Group>
            <Form.Label>Recipt Number / Id</Form.Label>
            <Form.Control type='text'/>
          </Form.Group>
          <Form.Group>
            <Form.Label>Supplier Name</Form.Label>
            <InputGroup>
            <Form.Control value={searchKey} onChange={(e)=> {
              e.preventDefault()
              supplierSearch(e.target.value)
            }}/>
            <Button variant='danger' onClick={()=> setSearchKey('')}>cancel</Button>
            </InputGroup>
          </Form.Group>
          {filteredSuppliers.length > 0 && (
              <ListGroup className='border rounded' variant='flush' 
                style={{overflowX: 'hidden', width: 130, maxHeight: 200, zIndex: 100, overflowY: 'auto'}}>
                {filteredSuppliers.map((supp)=> (
                  <ListGroup.Item key={supp.controlId} onClick={()=> {
                    setSupplier(supp)
                    setSearchKey(supp.name)
                    setFilteredsuppliers([])
                  }}>
                    {supp.name}
                  </ListGroup.Item>
                ))}
              </ListGroup>
          )}
          <Form.Group>
            <Form.Label>Amount</Form.Label>
            <Form.Control type='number'/>
          </Form.Group>
          <Form.Group>
            {['cash', 'card', 'bank'].map((item, index)=>(
              <Form.Check 
              label={item} 
              key={index} 
              type='radio'
              value={item}
              checked={selectedPaymentMthd === item}
              onChange={handlePaymentChange}
              />
            ))}
          </Form.Group>
          {selectedPaymentMthd === 'bank' && (
            <Form.Group className='mb-3'>
              <Form.Label>Bank Name</Form.Label>
              <Form.Select>
                <option>---select---</option>
                {banks.map((bank, index)=>(
                  <option key={index}>{bank.bankName}</option>
                ))}
              </Form.Select>
            </Form.Group>
          )}
          <Form.Group>
            <Form.Label>Notes</Form.Label>
            <Form.Control as='textarea' rows={5} type='text' placeholder='write something here'/>
          </Form.Group>
        </Form.Group>
        <div className='d-flex align-self-end p-2'>
        <Button type='submit' className='m-3'>SAVE</Button>
        <Button variant='success' type='submit' className='m-3'>SAVE & PRINT</Button>
        <Button variant='danger' className='m-3'>CANCEL</Button>
        </div>
      </Form>
    </Container>
  )
}
