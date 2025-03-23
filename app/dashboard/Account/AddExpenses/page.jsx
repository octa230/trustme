'use client'

import React, {useEffect, useState} from 'react'
import { Button, Form, InputGroup, Container } from 'react-bootstrap'
import Calender from '@/app/components/Calender'
import axios from 'axios'
import { toast } from 'react-toastify'


const page = () => {
  const [selectedPaymentMthd, setSelectedPaymentMthd] = useState('')
  const [expenseAccounts, setExpenseAccounts] = useState([])
  const [banks, setBanks] = useState([])
  const [expense, setExpense] = useState({
    date: null,
    paymentMethod: selectedPaymentMthd,
    recieptNumber: '',
    account: "",
    amount: 0,
    vat: 0,
    bankName: '',
    totalAmount: 0,
    cardAmount: 0,
    bankAmount: 0,
    cashAmount: 0,
    billFile: '',
    notes:''
  })


  const handlePaymentChange =(e)=>{
    const value = e.target.value
    setSelectedPaymentMthd(value)
    handlePaymentMethod(value)
  }

  const handleDate=(newDate)=>{
    setExpense(prevState => ({
      ...prevState,
      date: newDate
    }))
  }

  const handlePaymentMethod=(selectedPaymentMthd)=>{
    switch(selectedPaymentMthd){
      case 'card':
        console.log(selectedPaymentMthd)
        setExpense(prevState => ({...prevState, cardAmount: expense.totalAmount}))
        break;
      case 'cash':
        console.log(selectedPaymentMthd)
        setExpense(prevState => ({...prevState, cashAmount: expense.totalAmount}))
        break;
      case 'bank':
        console.log(selectedPaymentMthd)
        setExpense(prevState => ({...prevState, bankAmount: expense.totalAmount}))
      default:
        return 
    }
  }

  const getAccounts=async()=>{
    const [expRes, bankRes ]= await Promise.all([
      axios.get(`/api/accounts?name=${1}`),
      axios.get(`/api/banks`)
    ])
    setExpenseAccounts(expRes.data)
    setBanks(bankRes.data)
  }

  useEffect(()=>{
    getAccounts()
  },[])


  const handleSubmit=async(e)=>{
    e.preventDefault()
    toast.promise(
      axios.post('/api/expenses', expense),
      {
        pending:'...wait',
        success: 'Done',
        error: "Opps try Again"
      }
    )
    console.log(expense)
  }




  return (
    <Container fluid className='col-md-5 border rounded'>
      <Form onSubmit={handleSubmit}>
        <h2>ADD EXPENSE</h2>
        <hr/>
        <Form.Group>
          <Form.Group>
            <Calender title='Date' onChange={handleDate} value={expense.date}/>
          </Form.Group>
          <Form.Group>
            <Form.Label>Recipt Number / Id</Form.Label>
            <Form.Control type='text'  required value={expense.recieptNumber} 
              onChange={(e)=> setExpense(prevState => ({...prevState, recieptNumber: e.target.value}))}/>
          </Form.Group>
          <Form.Group>
            <Form.Label>Expense Name</Form.Label>
            <Form.Select onChange={(e)=> setExpense(prevState => ({...prevState, account: e.target.value}))}>
              <option>---select---</option>
              {expenseAccounts.map((item, index)=>(
                <option key={index} value={item._id}>{item.name}</option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group>
            <Form.Label>Expense Amount</Form.Label>
            <Form.Control required  type='number' value={expense.amount} onChange={(e)=> setExpense(prevState => ({...prevState, amount: e.target.value}))}/>
          </Form.Group>
          <Form.Group>
            <Form.Label>Expense Vat</Form.Label>
            <Form.Control required  type='number' value={expense.vat} onChange={(e)=> setExpense(prevState => ({...prevState, vat: e.target.value}))}/>
          </Form.Group>
          <Form.Group>
            <Form.Label>Total Expense</Form.Label>
            <Form.Control  required type='number' value={expense.totalAmount} onChange={(e)=> setExpense(prevState => ({...prevState, totalAmount: e.target.value}))}/>
          </Form.Group>
          <Form.Group>
            {['cash', 'card', 'bank'].map((item, index)=>(
              <Form.Check 
              label={item} 
              key={index} 
              //type='radio'
              value={item}
              checked={selectedPaymentMthd === item}
              onChange={handlePaymentChange}
              />
            ))}
          </Form.Group>
          {selectedPaymentMthd === 'bank' && (
            <Form.Group className='mb-3'>
              <Form.Label>Bank Name</Form.Label>
              <Form.Select  required onChange={(e)=> setExpense(prevState => ({...prevState, bankName: e.target.value}))}>
                <option>---select---</option>
                {banks.map((bank, index)=>(
                  <option key={index} value={bank.name}>{bank.name}</option>
                ))}
              </Form.Select>
            </Form.Group>
          )}
          <Form.Group>
            <InputGroup>
              <Form.Control type='text' id='addon1'/>
              <Button aria-describedby='addon1' variant='warning'>upload file</Button>
            </InputGroup>
          </Form.Group>
          <Form.Group>
            <Form.Label>Notes</Form.Label>
            <Form.Control as='textarea' rows={5} value={expense.notes}  required 
              onChange={(e)=> setExpense(prevState => ({...prevState, notes: e.target.value}))}
              type='text' 
              placeholder='write something here'/>
          </Form.Group>
        </Form.Group>
        <div className='d-flex align-self-end p-2'>
        <Button type='submit' className='m-3'>SAVE</Button>
        <Button variant='danger' className='m-3'>CANCEL</Button>
        </div>
      </Form>
    </Container>
  )
}

export default page
