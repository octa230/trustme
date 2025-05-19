'use client'




///THIS IS SUPPOSED TO BE DEPENDANT ON 
// PURCHASE ORDER OR ENQUIRIES IN THE DATABASE DESIGN



import Calender from '@/app/components/Calender'
import DataTable from '@/app/components/DataTable'
import { useStore } from '@/app/Store'
import axios from 'axios'
import debounce from 'lodash.debounce'
import React, { useRef, useContext, useEffect, useState, useCallback } from 'react'
import { InputGroup, Form, Row, Card, Button, Accordion, ListGroup } from 'react-bootstrap'



export default function PurchasePage() {

  const [supplier, setSupplier] = useState({
    name: "",
    mobile: "",
    phone: "",
    email:"",
    address: "",
    description:"",
    trn:""
  })

  const [purchase, setPurchase] = useState({
    purchaseNo:"",
    description:"",
    invoiceNo:""

  })

  const [file, setFile] = useState('')
  const [searchKey, setSearchKey] = useState('')
  const [suppliers, setSuppliers ] = useState([])


  const {state, dispatch: ctxDispatch} = useContext(useStore)
  const {userData} = state
  const dropDownRef = useRef(null)


  ///POST REQUEST TO SAVE NEW SUPPLIER FROM DROPDOWN
  const saveNewSupplier =async(e)=>{
    e.preventDefault()

    try{
      const { data } = await axios.post('/api/supplier', {
        name: supplier.name,
        mobile: supplier.mobile,
        email: supplier.email,
        phone: supplier.phone,
        address: supplier.address,
        description: supplier.description,
        trn: supplier.trn
      })
  
      if(data && window.confirm('use new supplier data?')){
        ctxDispatch({type:"SAVE_SUPPLIER", payload: data})
        setSupplier(data)
      }else{
        setSupplier({})
      }
    }catch(error){
      console.log(error)
    }

  }

  
  const searchSupplier = async (searchKey) => {
    try {
      const searchData = await axios.get(`/api/supplier/search`, {
        params: { searchKey: searchKey.toString() }, // Send searchKey as a query parameter
      });
      setSuppliers(searchData.data);
    } catch (error) {
      console.error('Error fetching suppliers:', error);
    }
  };

  const debounceSearch = useCallback(debounce((searchKey)=>{
    searchSupplier(searchKey)
  }, 500), [])

  useEffect(()=>{
    if(searchKey){
      debounceSearch(searchKey)
    }else{
      setSuppliers([])
    }


    //clean up function
    return ()=> debounceSearch.cancel()
  }, [searchKey, debounceSearch])
  
 

  return (
    <div>
      <h1>Purchase</h1>
      <Row>
      <Card className='col-md-3 position-relative'>
        <Card.Header>
          <Card.Title>Search Supplier</Card.Title>
        </Card.Header>
        <InputGroup aria-describedby='addon' className='m-2'>
          <Form.Control type='text' value={searchKey} onChange={(e)=> setSearchKey(e.target.value)}/>
            <Button onClick={()=>{
              setSearchKey(''),
              setSuppliers([])
            }}>cancel</Button>
        </InputGroup>
        {suppliers && suppliers.length > 0 &&(
          <ListGroup ref={dropDownRef} as='ul' className='position-absolute top-100'
            style={{ border: '1px solid #ccc', maxHeight: '200px', overflowY: 'auto', cursor:"pointer", zIndex:"100"}}>
            {suppliers.map((supp)=>(
              <ListGroup.Item key={supp._id} as='li' onClick={(e)=> {
                e.preventDefault()
                setSupplier(supp)
                ctxDispatch({type:"SAVE_SUPPLIER", payload: supp})
                setSuppliers([])
              }} variant='flush'>
                {supp.name}
                </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Card>

      <Card className='col-md-3 mx-1'>
        <Accordion className='m-1'>
          <Accordion.Item eventKey='0'>
            <Accordion.Header>
                {supplier?.name || ' Create Supplier'}
              </Accordion.Header>
                <Accordion.Body>
                    <Form onSubmit={saveNewSupplier}>
                      <Form.Group>
                        <Form.Label>Name</Form.Label>
                        <Form.Control type='text'
                          value={supplier.name || ''}
                          onChange={(e)=>{
                            setSupplier((prevState)=> ({...prevState, name: e.target.value}))
                          }}
                        />
                      </Form.Group>
                      <Form.Group>
                        <Form.Label>TRN</Form.Label>
                        <Form.Control type='text'
                          value={supplier.trn || ''}
                          onChange={(e)=>{
                            setSupplier((prevState)=> ({...prevState, trn: e.target.value}))
                          }}
                        />
                      </Form.Group>
                      <Form.Group>
                        <Form.Label>Mobile</Form.Label>
                        <Form.Control type='text'
                          value={supplier.mobile || ''}
                          onChange={(e)=> {
                            setSupplier((prevState)=> ({...prevState, mobile: e.target.value}))
                          }}
                        />
                      </Form.Group>
                      <Form.Group>
                        <Form.Label>Phone</Form.Label>
                        <Form.Control type='text'
                          value={supplier.phone || ''}
                          onChange={(e)=>{
                            setSupplier((prevState)=> ({...prevState, phone: e.target.value}))
                          }}
                        />
                      </Form.Group>
                      <Form.Group>
                        <Form.Label>Address</Form.Label>
                        <Form.Control
                          as='textarea' rows={3}
                          placeholder='supplier location / address here...'
                            value={supplier.address || ''}
                            onChange={(e)=>{
                              setSupplier((prevState)=> ({...prevState, address: e.target.value}))
                            }}
                        />
                      </Form.Group>
                      <Form.Group>
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                          as='textarea' rows={5}
                          placeholder='write something here...'
                            value={supplier.description || ''}
                            onChange={(e)=>{
                              setSupplier((prevState)=> ({...prevState, description: e.target.value}))
                            }}
                        />
                      </Form.Group>
                      <Form.Group>
                        <Form.Label>Supplier Email</Form.Label>
                        <Form.Control type='text'
                          value={supplier.email || ''}
                          onChange={(e)=>{
                            setSupplier((prevState)=> ({...prevState, email: e.target.value}))
                          }}
                        />
                      </Form.Group>
                      <Button type='submit' className='m-3'>SAVE</Button>
                      <Button variant='danger' className='m-3' onClick={(e)=>{
                        setSupplier({})
                      }}>CLEAR</Button>
                    </Form>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </Card>
      <Card className='col-md-3 mx-1'>
        <Accordion className='m-1'>
          <Accordion.Item eventKey='1'>
            <Accordion.Header>
              Purchase Details
            </Accordion.Header>
            <Accordion.Body>
                <Form>
                  <Form.Group>
                      <Form.Label>Supplier TRN</Form.Label>
                        <Form.Control type='text' placeholder={supplier?.trn}/>
                      </Form.Group>
                      <Form.Group>
                        <Calender title='PO Date'/>
                      </Form.Group>
                      <Form.Group>
                        <Calender title='Invoice Date'/>
                      </Form.Group>
                      <Form.Group>
                        <Form.Label>Logged In User</Form.Label>
                        <Form.Control type='text' 
                          placeholder={userData?.username} disabled/>
                      </Form.Group>
                      <Form.Group>
                        <Form.Label>Purchase Order Number</Form.Label>
                        <Form.Control type='text'
                          value={purchase.purchaseNo}
                          onChange={(e)=>{
                            setPurchase((prevState)=> ({...prevState, purchaseNo: e.target.value}))
                          }}
                        />
                      </Form.Group> 
                      <Form.Group>
                        <Form.Label>Invoice Number</Form.Label>
                        <Form.Control type='text'
                          value={purchase.invoiceNo}
                          onChange={(e)=>{
                            setPurchase((prevState)=> ({...prevState, invoiceNo: e.target.value}))
                          }}
                        />
                      </Form.Group>
                      {/* <Form.Group>
                      <Form.Label>Purchase Number</Form.Label>
                        <Form.Control type='text' 
                          placeholder='101' value={purchase.purchaseNo}
                          />
                      </Form.Group> */}
                      <Form.Group>
                      <Form.Label>Upload file</Form.Label>
                        <Form.Control type='file' placeholder='supporting Documents'/>
                      </Form.Group>
{/* 
                      <Form.Group>
                        <Form.Label>Description</Form.Label>
                        <Form.Control as='textarea' rows={5}
                          value={}
                          placeholder='Write something here'
                        />
                      </Form.Group> */}
                    <Button type='submit' className='mt-3'>SAVE</Button>
                  </Form>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </Card>
      <DataTable type={'purchase'}/>
    </Row>
    </div>
  )
}
