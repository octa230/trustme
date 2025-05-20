'use client'

import Calender from '@/app/components/Calender'
import DataTable from '@/app/components/DataTable'
import { useStore } from '@/app/Store'
import axios from 'axios'
import debounce from 'lodash.debounce'
import React, { useState, useRef, useCallback, useEffect, useContext } from 'react'
import { InputGroup, Form, Col, Row, Card, Button, Accordion, ListGroup } from 'react-bootstrap'
import { toast } from 'react-toastify'




export default function QuotationsPage() {

  const [searchKey, setSearchKey] = useState('')
  const [customers, setCustomers] = useState([])

  const dropdownRef = useRef(null)
  const {state, dispatch} = useContext(useStore)


  const [customer, setCustomer] = useState({
      name:"",
      mobile:"",
      controlId:'',
      phone:"",
      email:"",
      region:"",
      address:"",
      trn:"",
      description:""
  
    })


  const handleSubmit = async(e)=>{
    e.preventDefault()
    toast.promise(
      axios.post(`/api/customers`, customer),
      {
        pending: "...wait",
        success: 'Done',
        error:"Oops, try again"
      },
      {
        autoClose: 3000
      }
    )
  }


  const searchCustomers = async(searchKey)=>{
    try{
      const searchData = await axios.get(`/api/customers/search`, {
        params: {searchKey: searchKey.toString()}
      })
  
      setCustomers(searchData.data)
    }catch(error){
      console.log(error)
    }
  }


  const debounceSearch = useCallback(
    debounce((searchKey)=> {
      searchCustomers(searchKey)
    }, 500),
    []
  )

  useEffect(()=> {
    if(searchKey){
      debounceSearch(searchKey)
    }else{
      setCustomers([])
    }



    return ()=> debounceSearch.cancel()
  }, [searchKey, debounceSearch])











  return (
    <div>
      <h1>Quotations</h1>
      <Row>
      <Card className='col-md-3'>
        <Card.Header>
          <Card.Title>Search Customer</Card.Title>
        </Card.Header>
        <InputGroup aria-describedby='addon' className='m-2'>
          <Form.Control type='text' 
            value={searchKey}
            placeholder='search customer'
            onChange={(e)=> setSearchKey(e.target.value)}
          />
          <Button onClick={(e)=>{
            setSearchKey('')
            setCustomers([])
          }}>Cancel</Button>
        </InputGroup>
        {customers && customers.length > 0 && (
          <ListGroup ref={dropdownRef} as='ul' 
            className='position-absolute top-100 overflow-y-scroll'>
            {customers.map((custm)=>(
              <ListGroup.Item as='li' key={custm.controlId}
                onClick={(e)=>{
                e.preventDefault()
                setCustomer({})
                dispatch({type: "SAVE_CUSTOMER", payload: custm})
                setCustomer(custm)
                setCustomers([])
              }}>
                {custm.name}
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Card>

      <Card className='col-md-3 mx-1'>
        <Accordion className='m-1'>
          <Accordion.Item eventKey='0'>
            <Accordion.Header>
                {customer.name || 'New Customer'}
            </Accordion.Header>
            <Accordion.Body>
                    <Form onSubmit={handleSubmit}>
                      <Form.Group>
                        <Form.Label>Name</Form.Label>
                        <Form.Control type='text'
                        value={customer.name || ''}
                        onChange={(e)=> setCustomer(prevState => ({...prevState, name: e.target.value}))}
                        />
                      </Form.Group>
                      <Form.Group>
                        <Form.Label>Mobile</Form.Label>
                        <Form.Control type='text'
                          value={customer.mobile || ''}
                          onChange={(e)=> setCustomer(prevState => ({...prevState, mobile: e.target.value}))}
                        />
                      </Form.Group>
                      <Form.Group>
                        <Form.Label>Phone</Form.Label>
                        <Form.Control type='text'
                          value={customer.phone || ''}
                          onChange={(e)=> setCustomer(prevState => ({...prevState, phone: e.target.value}))}
                        />
                      </Form.Group>
                      <Form.Group>
                        <Form.Label>Email</Form.Label>
                        <Form.Control type='text'
                          value={customer.email || ''}
                          onChange={(e)=> setCustomer(prevState => ({...prevState, email: e.target.value}))}
                        />
                      </Form.Group>
                      <Form.Group>
                        <Form.Label>Emirate Region</Form.Label>
                        <Form.Control type='text'
                        value={customer.region || ''}
                        onChange={(e)=> setCustomer(prevState => ({...prevState, region: e.target.value}))}
                        />
                      </Form.Group>
                      <Form.Group>
                        <Form.Label>Address</Form.Label>
                        <Form.Control type='text'
                          placeholder='location/ address'
                          value={customer.address || ''}
                          onChange={(e)=> setCustomer(prevState => ({...prevState, address: e.target.value}))}
                        />
                      </Form.Group>
                      <Form.Group>
                        <Form.Label>Trn</Form.Label>
                        <Form.Control type='text'
                          value={customer.trn || ''}
                          onChange={(e)=> setCustomer(prevState => ({...prevState, trn: e.target.value}))}
                          placeholder='Tax Registration Number'
                        />
                      </Form.Group>
                      <Form.Group>
                        <Form.Label>Trn</Form.Label>
                        <Form.Control type='text' as='textarea'
                          rows={3}
                          value={customer.description || ''}
                          onChange={(e)=> setCustomer(prevState => ({...prevState, description: e.target.value}))}
                          placeholder='write something here'
                        />
                      </Form.Group>
                      <Button type='submit' className='mt-3'>SAVE</Button>
                    </Form>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </Card>
      <Card className='col-md-3 mx-1'>
        <Accordion className='m-1'>
          <Accordion.Item eventKey='1'>
            <Accordion.Header>
                Qutation Details
            </Accordion.Header>
            <Accordion.Body>
                <Form>
                  <Form.Group>
                      <Form.Label>Quotation Number</Form.Label>
                        <Form.Control type='text' placeholder='101'/>
                      </Form.Group>
                      <Form.Group>
                        <Calender title='Quotation Date'/>
                      </Form.Group>
                      <Form.Group>
                        <Form.Label>Logged In User</Form.Label>
                        <Form.Control type='text' placeholder='example-user' disabled/>
                      </Form.Group>
                      
                      <Form.Group>
                        <Form.Label>Description</Form.Label>
                        <Form.Control as='textarea' rows={5}
                          placeholder='Write something here'
                        />
                      </Form.Group>
                    <Button type='submit' className='mt-3'>SAVE</Button>
                  </Form>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </Card>

      <DataTable type={'quotation'}/>
      </Row>
    </div>
  )
}
