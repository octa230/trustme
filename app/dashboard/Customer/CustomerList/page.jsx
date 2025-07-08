'use client'

import Calender from '@/app/components/Calender'
import {Container, ButtonToolbar, Col, Row, Form, ButtonGroup, Modal, Button, Table } from 'react-bootstrap'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import XlsExportButon from '@/app/components/XlsExportButon'
import { round2 } from '../../utils'



const CustomersPage =()=> {

  const [customers, setCustomers] = useState([])
  const [openModal, setOpenModal] = useState(false)
  const [customer, setCustomer] = useState({
    _id:"",
    name:"",
    mobile:"",
    phone:"",
    email:"",
    region:"",
    address:"",
    trn:""
  })


  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const updatePromise = axios.put(`/api/customers/${customer?._id}`, customer);

    // Show toast while waiting for the promise
    toast.promise(updatePromise, {
      pending: '...wait',
      success: 'Done',
      error: 'Oops try again',
    }, {
      autoClose: 3000,
    });

    const response = await updatePromise; // ✅ Await the response
    const updatedCustomer = response.data;

    // ✅ Reset form and modal
    setCustomer({
      name: "",
      mobile: "",
      phone: "",
      email: "",
      region: "",
      address: "",
      trn: "",
    });
    setOpenModal(false);

    // ✅ Update the suppliers list with the updated data
    setCustomers((prevCustomers) =>
      prevCustomers.map((s) => s._id === updatedCustomer._id ? updatedCustomer : s)
    );

  } catch (error) {
    console.error('Update failed:', error);
  }
  };



  const handleEditCustomer=(selectedCustomer)=>{
    setCustomer({...selectedCustomer})
    setOpenModal(true)
  }

  const handleDeleteCustomer = async (selectedCustomer) => {
  if (window.confirm('Delete Supplier?')) {
    const deletePromise = axios.delete(`/api/customers/${selectedCustomer?._id}`);

    toast.promise(deletePromise, {
      pending: "...wait",
      success: "Done",
      error: "Error deleting supplier",
    }, {
      autoClose: 3000, // use 3000ms (3s) for visibility
    });

    try {
      await deletePromise;

      // ✅ Only update state if deletion was successful
      setCustomers(prevCustomers => 
        prevCustomers.filter(customer => customer._id !== selectedCustomer._id)
      );
    } catch (error) {
      console.error("Failed to delete supplier:", error);
    }
  }
};



  useEffect(()=>{
    const getCustomers = async()=>{
      try{
        const {data} = await axios.get('/api/customers')
        setCustomers(data)
        console.log(data)
      }catch(error){
        console.log(error)
      }
    }
    getCustomers()
  }, [])

  return (
    <Container fluid>
    <h1>Customer List</h1>
    <Row className='bg-light p-3 border'>
    <ButtonToolbar className='mb-2'>
      <Col className='col-md-2'>
      <Calender title='FromDate'/>
      </Col>
      <Col className='mx-1 col-md-2'>
      <Calender title='EndDate'/>
      </Col>
      <Col className='m-1 col-xs-12'>
      <Form.Control type='text' placeholder='customer Mobile'/>
      </Col>
      <Col className='m-1'>
      <Form.Control type='text' placeholder='customer Name'/>
      </Col>
      <Col className='m-1'>
      <Form.Control type='text' placeholder='customer Email'/>
      </Col>
      <Col className='m-1'>
      <Form.Control type='text' placeholder='customer TRN'/>
      </Col>
      <Col>
      <Col className='m-1 col-xs-12'>
      <ButtonGroup>
      <Button size='md' variant='outline-danger'>RESET</Button>
      <Button size='md' variant='outline-warning'>SEARCH</Button>
      <XlsExportButon data={customers}/>
      <Button size='md'>PRINT</Button>
      </ButtonGroup>
      </Col>
      </Col>
    </ButtonToolbar>
    <Row>
      <Col className='col-md-2'>
        <Form.Group>
          <Form.Select>
            <option>--entries--</option>
            {[100, 150, 200, 250].map((x, index)=>(
              <option key={index}>{x}</option>
            ))}
      </Form.Select>
      </Form.Group>
      </Col>
      <Col className='col-md-5'>
        <Form.Group>
          <Form.Control type='text' placeholder='search'/>
        </Form.Group>
      </Col>
      <Col>
        <Button variant='danger' onClick={(e)=> {
          window.location.href = '/dashboard/Customer/AddCustomer'
        }}>ADD CUSTOMER</Button>
        <Button variant='danger' className='mx-1' onClick={(e)=> {
          window.location.href = '/dashboard/Customer/CustomerAdvance'
        }}
        >ADD CUSTOMER ADVANCE</Button>
      </Col>
    </Row>
    </Row>
    <div className='d-flex mt-1 bg-light p-2'>
      <Col>
        <h3 className='text-danger'>TOTAL CREDITS</h3>
      </Col>
      <Col className='col-md-3 border'>
      <h3 className='text-danger p-1'>0.00</h3>
      </Col>
    </div>
    <Table striped='columns' bordered hover className='m-2'>
      <thead>
        <tr>
          <th>#</th>
          <th>CtrlNo</th>
          <th>Name</th>
          <th>Phone</th>
          <th>Email</th>
          <th>TRN</th>
          <th>Pending Amt</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {customers.map((customer, index) =>(
          <tr key={customer._id}>
            <td>{index}</td>
            <td>{customer.controlId}</td>
            <td>{customer.name}</td>
            <td>{customer.phone}</td>
            <td>{customer.email}</td>
            <td>{customer.trn}</td>
            <td>{round2(customer.pendingAmount || 0)}</td>
            <td>
              <Button onClick={()=> handleEditCustomer(customer)}>Edit</Button>
              <Button className='m-1' variant='outline-danger' onClick={()=> handleDeleteCustomer(customer)}>Delete</Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
    <Modal show={openModal} onHide={()=> setOpenModal(false)}>
      <Modal.Header closeButton>
        Edit Customer
      </Modal.Header>
          <Modal.Body>
            <Form className='border p-2 rounded shadow-sm' onSubmit={handleSubmit}>
                <Form.Group>
                  <Form.Label>Name</Form.Label>
                  <Form.Control type='text'
                    value={customer.name}
                    onChange={(e)=> setCustomer(prevState=> ({...prevState, name: e.target.value}))}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Mobile</Form.Label>
                  <Form.Control type='text'
                    value={customer.mobile}
                    onChange={(e)=> setCustomer(prevState => ({...prevState, mobile: e.target.value}))}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Phone</Form.Label>
                  <Form.Control type='text'
                    value={customer.phone}
                    onChange={(e)=> setCustomer(prevState => ({...prevState, phone: e.target.value}))}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Email</Form.Label>
                  <Form.Control type='text'
                    value={customer.email}
                    onChange={(e)=> setCustomer(prevState=> ({...prevState, email: e.target.value}))}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Emirate Region</Form.Label>
                  <Form.Control type='text'
                    value={customer.region}
                    onChange={(e)=> setCustomer(prevState => ({...prevState, region: e.target.value}))}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Supplier Address</Form.Label>
                  <Form.Control type='text'
                    value={customer.address}
                    placeholder='location/ address'
                    onChange={(e)=> setCustomer(prevState => ({...prevState, address: e.target.value}))}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Customer TRN</Form.Label>
                  <Form.Control type='text'
                    maxLength={15}
                    minLength={15}
                    value={customer.trn}
                    placeholder='Tax Registration Number'
                    onChange={(e)=> setCustomer(prevState => ({...prevState, trn: e.target.value}))}
                  />
                </Form.Group>
                <ButtonGroup className='mt-2 shadow-sm border'>
                  <Button type='submit' variant='success'>SAVE</Button>
                  <Button type='submit' variant='danger' onClick={(e)=>{
                    e.preventDefault()
                    setOpenModal(false)
                    setCustomer({})
                  }}>CANCEL</Button>
            </ButtonGroup>
          </Form>
      </Modal.Body>
    </Modal>
  </Container>
  )
}

export default CustomersPage
