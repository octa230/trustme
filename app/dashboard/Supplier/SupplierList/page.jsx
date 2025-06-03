'use client'

import Calender from '@/app/components/Calender'
import {Container, ButtonToolbar, Col, Row, Form, ButtonGroup, Button, Table, Modal } from 'react-bootstrap'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import axios from 'axios'


export default function SupplierListPage() {

  const [openModal, setOpenModal] = useState(false)
   const [suppliers, setSuppliers] = useState([])
  const [supplier, setSupplier] = useState({
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
    const updatePromise = axios.put(`/api/supplier/${supplier?._id}`, supplier);

    // Show toast while waiting for the promise
    toast.promise(updatePromise, {
      pending: '...wait',
      success: 'Done',
      error: 'Oops try again',
    }, {
      autoClose: 3000,
    });

    const response = await updatePromise; // ✅ Await the response
    const updatedSupplier = response.data;

    // ✅ Reset form and modal
    setSupplier({
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
    setSuppliers((prevSuppliers) =>
      prevSuppliers.map((s) => s._id === updatedSupplier._id ? updatedSupplier : s)
    );

  } catch (error) {
    console.error('Update failed:', error);
  }
  };


  useEffect(()=>{
    const getData=async()=>{
      const {data} = await axios.get(`/api/supplier`)
      setSuppliers(data)
    }
    getData()
  },[])

  const handleEditSupplier=(selectedSupplier)=>{
    setSupplier({...selectedSupplier})
    setOpenModal(true)
  }

  const handleDeleteSupplier = async (selectedSupplier) => {
  if (window.confirm('Delete Supplier?')) {
    const deletePromise = axios.delete(`/api/supplier/${selectedSupplier?._id}`);

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
      setSuppliers(prevSuppliers => 
        prevSuppliers.filter(supplier => supplier._id !== selectedSupplier._id)
      );
    } catch (error) {
      console.error("Failed to delete supplier:", error);
    }
  }
};




  return (
    <Container fluid>
    <h1>Supplier List</h1>
    <Row className='bg-light p-3 border shadow-sm rounded'>
    <ButtonToolbar className='mb-2'>
      <Col className='col-md-2'>
      <Calender title='FromDate'/>
      </Col>
      <Col className='mx-1 col-md-2'>
      <Calender title='EndDate'/>
      </Col>
      <Col className='m-1 col-xs-12'>
      <Form.Control type='text' placeholder='Supplier Mobile'/>
      </Col>
      <Col className='m-1'>
      <Form.Control type='text' placeholder='Supplier Name'/>
      </Col>
      <Col className='m-1'>
      <Form.Control type='text' placeholder='Supplier Email'/>
      </Col>
      <Col className='m-1'>
      <Form.Control type='text' placeholder='Supplier TRN'/>
      </Col>
      <Col>
      <Col className='m-1 col-xs-12'>
      <ButtonGroup>
      <Button size='md' variant='outline-danger'>RESET</Button>
      <Button size='md' variant='outline-warning'>SEARCH</Button>
      <Button size='md' variant='outline-success'>EXCEL</Button>
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
        <Button variant='danger' onClick={()=>{
          window.location.href = '/dashboard/Supplier/AddSupplier'
        }}>
          ADD SUPPLIER
        </Button>
        <Button variant='danger' className='mx-1'>ADD SUPPLIER ADVANCE</Button>
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
          <th>Address</th>
          <th>TRN</th>
          <th>Pending Amt</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {suppliers.map((supplier, index)=> (
          <tr key={supplier._id}>
            <td>{index}</td>
            <td>{supplier.controlId}</td>
            <td>{supplier.name}</td>
            <td>{supplier.phone}</td>
            <td>{supplier.email}</td>
            <td>{supplier.address}</td>
            <td>{supplier.trn}</td>
            <td>{supplier.pendingAmount || 0}</td>
            <td>
              <Button onClick={()=> handleEditSupplier(supplier)}>
                Edit
              </Button>
              <Button className='m-1' onClick={()=> handleDeleteSupplier(supplier)}
                variant='outline-danger'>
                Delete
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>

    <Modal show={openModal} onHide={()=> setOpenModal(false)}>
      <Modal.Header closeButton>
        Edit Supplier
      </Modal.Header>
      <Modal.Body>
              <Form className='border p-2 rounded shadow-sm' onSubmit={handleSubmit}>
                <Form.Group>
                  <Form.Label>Name</Form.Label>
                  <Form.Control type='text'
                    value={supplier.name}
                    onChange={(e)=> setSupplier(prevState=> ({...prevState, name: e.target.value}))}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Mobile</Form.Label>
                  <Form.Control type='text'
                    value={supplier.mobile}
                    onChange={(e)=> setSupplier(prevState => ({...prevState, mobile: e.target.value}))}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Phone</Form.Label>
                  <Form.Control type='text'
                    value={supplier.phone}
                    onChange={(e)=> setSupplier(prevState => ({...prevState, phone: e.target.value}))}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Email</Form.Label>
                  <Form.Control type='text'
                    value={supplier.email}
                    onChange={(e)=> setSupplier(prevState=> ({...prevState, email: e.target.value}))}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Emirate Region</Form.Label>
                  <Form.Control type='text'
                    value={supplier.region}
                    onChange={(e)=> setSupplier(prevState => ({...prevState, region: e.target.value}))}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Supplier Address</Form.Label>
                  <Form.Control type='text'
                    value={supplier.address}
                    placeholder='location/ address'
                    onChange={(e)=> setSupplier(prevState => ({...prevState, address: e.target.value}))}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Supplier TRN</Form.Label>
                  <Form.Control type='text'
                    maxLength={15}
                    minLength={15}
                    value={supplier.trn}
                    placeholder='Tax Registration Number'
                    onChange={(e)=> setSupplier(prevState => ({...prevState, trn: e.target.value}))}
                  />
                </Form.Group>
                <ButtonGroup className='mt-2 shadow-sm border'>
                  <Button type='submit' variant='success'>SAVE</Button>
                  <Button type='submit' variant='danger' onClick={(e)=>{
                    e.preventDefault()
                    setOpenModal(false)
                    setSupplier({})
                  }}>CANCEL</Button>
              </ButtonGroup>
            </Form>
      </Modal.Body>
    </Modal>
  </Container>
  )
}
