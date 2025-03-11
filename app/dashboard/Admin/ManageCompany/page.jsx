'use client'

import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import { toast } from 'react-toastify'

export default function page() {

  const [company, setCompany] = useState({
    name:"",
    logo:"",
    poBox:"",
    controlId:"",
    footerLogo:"",
    description:"",
    mobile:"",
    phone:"",
    address:"",
    email:"",
    trn:"",
    website:"",
    description:"",
    printFormat:""
  })


  useEffect(()=>{
    const getCompany = async()=>{ 
      const {data} = await axios.get(`/api/company`)
      console.log(data)
      setCompany(data)
    }
    getCompany()
  },[])


  const handleSubmit = async(e)=>{
    e.preventDefault()
    
    try{
      toast.promise(
        axios.put(`/api/company/${company._id}`, {...company}),
        {
          pending: "...wait",
          success:'Done',
          error: "Oops, try again"
        },
        {
          autoClose: 3000
        }
      )
      console.log(company)
    }catch(error){
      console.log(error)
    }
  }

  return (
    <div className='d-flex justify-content-center'>

      <Form onSubmit={handleSubmit} className='border rounded shadow-sm col-md-5 p-2'>
        <h2>MANAGE COMPANY INFO</h2>
        <Form.Group>
          <Form.Label>Registred Company Name</Form.Label>
          <Form.Control
            type='text'
            value={company.name || ''}
            onChange={(e)=> setCompany(prevState => ({...prevState, name: e.target.value}))}
          />
        </Form.Group>
        <Form.Group>
          <Form.Group>PO.Box</Form.Group>
          <Form.Control
            type='text'
            value={company.poBox || ''}
            onChange={(e)=> setCompany(prevState => ({...prevState, poBox: e.target.value}))}
          />
        </Form.Group>
        <Form.Group>
          <Form.Group>Company Email</Form.Group>
          <Form.Control
            type='text'
            value={company.email || ''}
            onChange={(e)=> setCompany(prevState => ({...prevState, email: e.target.value}))}
          />
        </Form.Group>
        <Form.Group>
          <Form.Group>TRN</Form.Group>
          <Form.Control
            type='text'
            value={company.trn || ''}
            placeholder='tax registration Number'
            onChange={(e)=> setCompany(prevState => ({...prevState, trn: e.target.value}))}
          />
        </Form.Group>
        <Form.Group>
          <Form.Group>Website</Form.Group>
          <Form.Control
            type='text'
            value={company.website || ''}
            placeholder='http://www.domain.com'
            onChange={(e)=> setCompany(prevState => ({...prevState, website: e.target.value}))}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Company Logo</Form.Label>
          <Form.Control aria-required='true'
            type='file'

          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Address</Form.Label>
          <Form.Control as='textarea' rows={3}
            required
            type='text'
            value={company.address || ''}
            onChange={(e)=> setCompany(prevState => ({...prevState, address: e.target.value}))}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Footer Logo</Form.Label>
          <Form.Control aria-required='true'
            type='file'
            //value={company.footerLogo || ''}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Telephone / Landline</Form.Label>
          <Form.Control
            type='telephone'
            value={company.phone || ''}
            onChange={(e)=> setCompany(prevState => ({...prevState, phone: e.target.value}))}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Mobile Contact</Form.Label>
          <Form.Control
            type='telephone'
            value={company.mobile || ''}
            onChange={(e)=> setCompany(prevState => ({...prevState, mobile: e.target.value}))}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Company Description</Form.Label>
          <Form.Control as='textarea' rows={5}
            aria-required='true'
            type='text'
            value={company.description || ''}
            onChange={(e)=> setCompany(prevState => ({...prevState, description: e.target.value}))}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>ControlId</Form.Label>
          <Form.Control
            type='text'
            value={company.controlId || ''} 
            disabled
            onChange={(e)=> setCompany(prevState => ({...prevState, controlId: e.target.value}))}
          />
        </Form.Group>


        <Button type='submit' className='my-1'>Submit</Button>
      </Form>
    </div>
  )
}
