'use client'

import Calender from '@/app/components/Calender'
import DataTable from '@/app/components/DataTable'
import { useStore } from '@/app/Store'
import axios from 'axios'
import debounce from 'lodash.debounce'
import React,{useCallback, useContext, useEffect, useState} from 'react'
import { useRef } from 'react'
import { InputGroup, Form, Row, Card, Button, Accordion, ListGroup } from 'react-bootstrap'
import { toast } from 'react-toastify'


export default function page() {

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

  const [searchKey, setSearchKey] = useState('')
  const [customers, setCustomers] = useState([])


  const {state, dispatch: ctxDispatch} = useContext(useStore)
  const {customerData, userData} = state


  const dropDownRef = useRef(null)


  const handleSubmit = async(e)=>{
    e.preventDefault()
    toast.promise(
      axios.post(`/api/customers`, customer),
      {
        pending: '...wait',
        success: 'Done',
        error: "Oops, try again!"
      },
      {
        autoClose: 3000
      }
    )

    setCustomer({})

  }


  //SEARCH CUSTOMER

  const searchCustomer = async(searchKey)=>{
    try {
        const searchData = await axios.get(`/api/customers/search`, {
          params: {searchKey: searchKey.toString()}
        })
        setCustomers(searchData.data)
    } catch (error) {
      toast.error('something went wrong')
    }
  }

  const debounceSearch = useCallback(debounce((searchKey)=>{
    searchCustomer(searchKey);
  }, 500), [])


  useEffect(()=>{
    if(searchKey){
      debounceSearch(searchKey)
    }else{
      setCustomers([])
    }

    ///clean up function
    return ()=> debounceSearch.cancel()
  }, [searchKey, debounceSearch])


  return (
    <div>
      <h1>Sales</h1>
      <Row>
      <Card className='col-md-3'>
        <Card.Header>
          <Card.Title>Search Customer</Card.Title>
        </Card.Header>
        <InputGroup aria-describedby='addon' className='m-2'>
          <Form.Control type='text'
            value={searchKey}
            onChange={(e)=> setSearchKey(e.target.value)}
          />
          <Button onClick={()=>{
            setSearchKey(''),
            setCustomers([])
          }}>cancel</Button>
        </InputGroup>
        {customers && customers.length > 0 && (
          <ListGroup as='ul' ref={dropDownRef} className='position-absolute top-100'
            variant='flush'
            style={{ maxHeight: '200px', overflowY: 'auto', cursor:"pointer", zIndex:"100"}}>
            {customers.map((custm)=> (
              <ListGroup.Item key={custm._id} as='li' onClick={(e)=>{
                e.preventDefault()
                setCustomer(custm)
                ctxDispatch({type: "SAVE_CUSTOMER", payload: custm})
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
              {customer?.name || 'New Customer'}
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
                        <Form.Control type='telephone'
                          value={customer.mobile || ''}
                          onChange={(e)=> setCustomer(prevState => ({...prevState, name: e.target.value}))}
                        />
                      </Form.Group>
                      <Form.Group>
                        <Form.Label>Phone</Form.Label>
                        <Form.Control type='phone'
                          value={customer.phone || ''}
                          onChange={(e)=> setCustomer(prevState => ({...prevState, phone: e.target.value}))}
                        />
                      </Form.Group>
                      <Form.Group>
                        <Form.Label>Email</Form.Label>
                        <Form.Control type='email'
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
                        <Form.Label>TRN</Form.Label>
                        <Form.Control type='text'
                          placeholder='Tax Registration Number'
                          value={customer.trn || ''}
                          onChange={(e)=> setCustomer(prevState => ({...prevState, trn: e.target.value}))}
                        />
                      </Form.Group>
                      <Form.Group>
                        <Form.Label>Description</Form.Label>
                        <Form.Control type='text' as='textarea' rows={3}
                          placeholder='Description'
                          value={customer.description || ''}
                          onChange={(e)=> setCustomer(prevState => ({...prevState, description: e.target.value}))}
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
                      <Form.Label>Invoice Number</Form.Label>
                        <Form.Control type='text' placeholder='101'/>
                      </Form.Group>
                      <Form.Group>
                        <Calender title='Invoice Date'/>
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
      <DataTable type={'sales'}/>
    </Row>
    </div>
  )
}
