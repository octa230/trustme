"use client"
import { Button, Container, Form } from 'react-bootstrap'
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useStore } from './Store';



export default function Home() {

  const router = useRouter()

  const [user, setUser] = useState({
    username: '',
    password: ''
  })

  const {state} = useContext(useStore)
  const {userData} = state


  useEffect(()=>{
    const redirectUser =async()=>{
      if(userData){
        router.push('dashboard')
      }
    }

    redirectUser()
  }, [userData])

const handleSubmit = async(e)=>{
  e.preventDefault()

  const {data} = await axios.post(`/api/auth/login`, {
    username: user.username,
    password: user.password
  })
  //console.log(data)
  if(data._id){
    localStorage.setItem('userData', JSON.stringify(data))
    const saveduser = await localStorage.getItem('userData')
    if(saveduser){
      router.push('/dashboard')
    }

  }
}

  return (
     <Container fluid='md' 
      className="col-md-4 d-flex justify-content-center align-items-center" style={{height: '100vh'}} onSubmit={handleSubmit}>
      <Form className="w-100 border rounded p-3 shadow-sm">
        <h3 className='text-muted'>BUSINESS SOFTWARE SYSTEM</h3>
        <hr/>
        <Form.Group>
          <Form.Label>USERNAME</Form.Label>
          <Form.Control type='text' onChange={(e)=>{
            setUser((prevUser)=> ({...prevUser, username: e.target.value}))
          }}/>
          </Form.Group>
          <Form.Group>
          <Form.Label>PASSWORD</Form.Label>
          <Form.Control type='password' onChange={(e)=>{
            setUser((prevUser)=> ({...prevUser, password: e.target.value}))
          }}/>
        </Form.Group>
        <Button variant="success" type="submit" className="my-3 w-100">LOG IN</Button>
      </Form>
    </Container>
  );
}
