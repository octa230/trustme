'use client'

import React from 'react'
import { useState } from 'react';
import { Button, FormControl, InputGroup, Modal } from 'react-bootstrap';
import Calendar from 'react-calendar';

const Calender = ({setterFunc, type, title}) => {

    const [date, setDate] = useState(new Date())
    const [show, setShow] = useState(false)

    const handleDateChange =(date)=>{
        setDate(date)
        setterFunc(date)
        console.log(date)
    }
  return (
    <div>
        <InputGroup className='p-2'>
        <FormControl aria-describedby='addon1' placeholder={date.toLocaleDateString()}/>
        <Button id='addon1'
            onClick={()=> setShow(true)} 
            variant='outline-info text-dark text-weight-bold'>
                {title}
            </Button>
        </InputGroup>
      <Modal show={show} onHide={()=> setShow(false)} className='d-flex justify-content-center p-2'>
        <Modal.Header closeButton>
            {date.toLocaleDateString()}
        </Modal.Header>
      <Calendar onChange={handleDateChange} value={date}/>
      </Modal>
    </div>
  )
}

export default Calender
