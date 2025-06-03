'use client'

import XlsExportButton from '@/app/components/XlsExportButon'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import {Container, ButtonToolbar, Col, Row, Form, 
  ButtonGroup, Table, Button, Modal,InputGroup,  
  Stack} from 'react-bootstrap'
import { toast } from 'react-toastify'

const ItemsList =()=> {

  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [units, setUnits] = useState([])
  const [show, setShow] = useState(false)
  const [selectedItem, setSelectedItem] = useState({
      name:'',
      category:"",
      purchasePrice: '',
      unit:"",
      salePrice: '',
  })

  const [creatItem, setCreateItem] = useState({
        name:'',
        category:"",
        purchasePrice: '',
        unit:"",
        salePrice: '',
  })

  const handleCreateItem = (e) => {
  e.preventDefault();

  // Update existing item
  if (selectedItem && selectedItem._id) {
    toast.promise(
      axios.put(`/api/items/${selectedItem._id}`, creatItem)
        .then(res => {
          setProducts(prevProducts =>
            prevProducts.map(item => item._id === res.data._id ? res.data : item)
          );
          setCreateItem({
            name: '',
            category: '',
            purchasePrice: '',
            unit: '',
            salePrice: ''
          });
          setShow(false);
        }),
      {
        pending: "...Loading",
        success: "Done",
        error: "Oops! Try Again"
      }
    );
  } else {
    // Create new item
    toast.promise(
      axios.post('/api/items', creatItem)
        .then(res => {
          setProducts([...products, res.data]);
          setCreateItem({
            name: '',
            category: '',
            purchasePrice: '',
            unit: '',
            salePrice: ''
          });
          setShow(false);
        }),
      {
        pending: "..Wait",
        success: "Done",
        error: "Oops! Try Again"
      }
    );
  }
};

const handleDeleteItem = (Item) => {
  if (window.confirm('Delete Item?')) {
    toast.promise(
      axios.delete(`/api/items/${Item._id}`)
        .then(res => {
          setProducts(prevProducts => prevProducts.filter(item => item._id !== Item._id));
        }),
      {
        pending: "..waiting",
        success: 'Done!',
        error: 'Oops! Try Again'
      }
    );
  }
};

const handleEditItem = async (item) => {
  setSelectedItem(item);
  setCreateItem({ ...item });
  setShow(true);
};


  const getItems = async()=>{
    const [itemsRes, categoryRes, unitsRes] = await Promise.all([
      axios.get('/api/items'),
      axios.get('/api/category'),
      axios.get('/api/units'),
    ])
    setProducts(itemsRes.data)
    setCategories(categoryRes.data)
    setUnits(unitsRes.data)
  }

  useEffect(()=>{
    getItems()
  },[])

  return (
    <div>
      <Container fluid>
      <h1>Items List</h1>
      <Row className='bg-light p-3 border'>
      <ButtonToolbar className='mb-2'>

        <Col className='m-1 col-xs-12'>
        <Form.Control type='text' placeholder='category Name'/>
        </Col>
        <Col className='m-1 col-xs-12'>
        <Form.Control type='text' placeholder='Item Name'/>
        </Col>
        <Col className='m-1 col-xs-12'>
        <Form.Control type='text' placeholder='Barcodes'/>
        </Col>
        <Col className='m-1'>
        <Form.Control type='text' placeholder='Models'/>
        </Col>
        <Col className='m-1'>
        <Form.Control type='text' placeholder='Brands'/>
        </Col>
        <Col>
        <Col className='m-1 col-xs-12'>
        <ButtonGroup>
        <Button size='md' variant='outline-danger'>RESET</Button>
        <Button size='md' variant='outline-warning'>SEARCH</Button>
        <XlsExportButton data={products}/>
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
        <Col className='col-md-8'>
        <InputGroup>
          <Form.Control type='text' placeholder='search' aria-describedby='addon1'/>
            <Button id='addon1' variant='outline-dark'>
              🔍
            </Button>
        </InputGroup>
        </Col>
        <Col>
          <Button variant='danger' onClick={()=> setShow(true)}>
            ADD ITEM
          </Button>
        </Col>
      </Row>
      </Row>

      <Table striped='columns' bordered hover className='m-2'>
        <thead>
          <tr>
            <th>#</th>
            <th>ctrlId</th>
            <th>Category</th>
            <th>Name</th>
            <th>Units</th>
            <th>inStock</th>
            <th>Price</th>
            <th>Sale Price</th>
            <th>Barcode</th>
            <th>Brand</th>
            <th>Model</th>
            <th>Note</th>
            <th>Files</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index)=> (
            <tr key={product.code}>
              <td>{index +1}</td>
              <td>{product.code}</td>
              <td>{product.category}</td>
              <td>{product.name}</td>
              <td>{product.unit}</td>
              <td>{product.inStock}</td>
              <td>{product.purchasePrice}</td>
              <td>{product.salePrice}</td>
              <td>{product.barcode || 'NA'}</td>
              <td>{product.brand || 'NA'}</td>
              <td>{product.model || 'NA'}</td>
              <td>{product.note || 'NA'}</td>
              <td>{product.files || 'NO FIILES'}</td>
              <td>
                <Stack direction='horizontal' gap={2}>
                  <Button onClick={()=> handleEditItem(product)}>
                    Edit
                  </Button>
                  <Button variant='danger' onClick={()=> handleDeleteItem(product)}>
                    Delete
                  </Button>
                </Stack>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
    <Modal show={show} onHide={()=>{setShow(false)}} size='lg'>
        <Modal.Header closeButton>
          <Modal.Title>Add New Item</Modal.Title>
        </Modal.Header> 
        <Modal.Body>
          <Form onSubmit={handleCreateItem}>
            <Form.Group className='mb-3'>
              <Form.Label>Item Name</Form.Label>
              <Form.Control type='text' placeholder='Item Name' 
                value={creatItem.name} onChange={(e)=>setCreateItem({...creatItem, name: e.target.value})}/>
            </Form.Group>
            <Form.Group className='mb-3'>
              <Form.Label>Category</Form.Label>
              <Form.Control type='text' placeholder='Category' disabled
                value={creatItem.category} onChange={(e)=>setCreateItem({...creatItem, category: e.target.value})}/>
            </Form.Group>
            <Form.Select className='mb-3'
              value={creatItem.category} onChange={(e)=>setCreateItem({...creatItem, category: e.target.value})}>
              <option>--Select Category--</option>
              {categories.map((category, index)=>(
                <option key={index} value={category.name}>{category.name}</option>
              ))}
            </Form.Select>  
            <Row>
              <Col>
                <Form.Group className='mb-3'>
                  <Form.Label>Purchase Price</Form.Label>
                  <Form.Control type='number' placeholder='Purchase Price' 
                    value={creatItem.purchasePrice} onChange={(e)=>setCreateItem({...creatItem, purchasePrice: e.target.value})}/>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className='mb-3'>
                  <Form.Label>Unit</Form.Label>
                  <Form.Control type='text' disabled
                    placeholder='Unit' 
                    value={creatItem.unit} onChange={(e)=>setCreateItem({...creatItem, unit: e.target.value})}/>
                </Form.Group>
                <Form.Select className='mb-3'
                  value={creatItem.unit} onChange={(e)=>setCreateItem({...creatItem, unit: e.target.value})}>
                  <option>--Select Unit--</option>
                  {units.map((unit, index)=>(
                    <option key={index} value={unit.name}>{unit.name}</option>
                  ))}
                </Form.Select>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group className='mb-3'>
                  <Form.Label>Sale Price</Form.Label>
                  <Form.Control type='number' placeholder='Sale Price' 
                    value={creatItem.salePrice} onChange={(e)=>setCreateItem({...creatItem, salePrice: e.target.value})}/>
                </Form.Group>
              </Col>
            </Row>
              <Button variant='secondary' onClick={()=>setShow(false)}>Close</Button>
              <Button variant='primary' type='submit' className='mx-3'>Save Item</Button>
          </Form>
        </Modal.Body>
    </Modal>
    </div>
  )}



export default ItemsList