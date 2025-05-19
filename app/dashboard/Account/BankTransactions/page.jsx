'use client'


import React, { useContext, useEffect, useState } from 'react'
import { Button, Form, Container } from 'react-bootstrap'
import Calender from '@/app/components/Calender'
import axios from 'axios'
import { useStore } from '@/app/Store'

const BankTransactionsPage = () => {
  const {state} = useContext( useStore)
  const {userData} = state

  const [banks, setBanks] = useState([])
  const [date, setDate] = useState(null)
  const [txn, setTxn] = useState({
    type:'',
    user: userData ? userData.username : '',
    amount: 0,
    bankName:'',
    notes:'',
    date
  })

  const handleSubmit =async(e)=>{
    e.preventDefault()
    console.log(txn)
  }

  const handleDate=(newDate)=>{
    setTxn(prevState=> ({
      ...prevState, 
      date: newDate
    }))
  } 

  useEffect(()=>{
    const getBanks =async()=>{
      const {data} = await axios.get(`/api/banks`)
      setBanks(data)
    }
    getBanks()
  }, [])

  
  return (
    <Container className='col-md-5 border rounded p-1'>
      <h1>Bank Transactions</h1>
      <hr/>
      <Form onSubmit={handleSubmit}>
      <Form.Group>
        <Form.Label>LoggedIn User</Form.Label>
      <Form.Control placeholder={userData.username} readOnly/>
      </Form.Group>
        <Calender onChange={handleDate} value={txn.date} title='TRANSACTION DATE'/>
        <Form.Group>
          <Form.Label>Transaction Type</Form.Label>
          <Form.Select required
            onChange={(e)=> setTxn(prevState => ({...prevState, type: e.target.value}))}>
              <option>--select--</option>
            {['DEPOSIT', 'WITHDRAW'].map((txnType)=> (
            <option value={txnType} key={txnType}>{txnType}</option>
          ))}
          </Form.Select>
        </Form.Group>
        <Form.Group>
          <Form.Label>Select Bank</Form.Label>
          <Form.Select required
            onChange={(e)=> setTxn(prevState => ({...prevState, bankName: e.target.value}))}>
              <option>--select--</option>
            {banks.map((bank)=> (
            <option value={bank.name} key={bank.controlId}>{bank.name}</option>
          ))}
          </Form.Select>
        </Form.Group>
        <Form.Group>
          <Form.Label>Amount</Form.Label>
          <Form.Control required
            type='number' value={txn.amount} 
            onChange={(e)=> setTxn(prevState => ({...prevState, amount: e.target.value}))}/>
        </Form.Group>
        <Form.Group>
          <Form.Label>Notes</Form.Label>
          <Form.Control as='textarea' rows={5} required
            type='text' 
            value={txn.notes} onChange={(e)=> setTxn(prevState => ({...prevState, notes: e.target.value}))}/>
        </Form.Group>
        <Button type='submit' className='my-2'>Done</Button>
      </Form>
    </Container>
  )
}

export default BankTransactionsPage
