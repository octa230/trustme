'use client'

import React from 'react'
import { useState } from 'react';
import { Button, FormControl, InputGroup, Modal } from 'react-bootstrap';
import Calendar from 'react-calendar';

const Calender = ({value, onChange, title}) => {

    const [date, setDate] = useState(new Date())
    const [show, setShow] = useState(false)

    const handleDateChange =(date)=>{
        onChange(date)
        setShow(false)
        //setterFunc(date)
        //console.log(date)
    }
  return (
    <div>
        <InputGroup className='p-2'>
        <FormControl aria-describedby='addon1' placeholder={value ? value?.toLocaleDateString() : 'SELECT DATE'}/>
        <Button id='addon1' onClick={()=> setShow(true)} >
            {title}
          </Button>
        </InputGroup>
      <Modal show={show} onHide={()=> setShow(false)} className='d-flex justify-content-center p-2'>
        <Modal.Header closeButton className='text-danger'>
            {value?.toLocaleDateString()}
        </Modal.Header>
      <Calendar onChange={handleDateChange} value={value}/>
      </Modal>
    </div>
  )
}

export default Calender
