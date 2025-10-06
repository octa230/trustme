"use client"


import { Button, Container, Form } from 'react-bootstrap'
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useStore } from './Store';
import { toast } from 'react-toastify';



export default function Home() {

  const router = useRouter()

  const [user, setUser] = useState({
    username: '',
    password: ''
  })

  const {state, dispatch: ctxDispatch} = useContext(useStore)
  const { userData } = state


  useEffect(()=>{
    const redirectUser =async()=>{
      if(userData !== null){
        router.push('/dashboard')
      }
    }

    redirectUser()
  }, [userData])

  

  const handleSubmit = async (e) => {
  e.preventDefault();
  
  // Use toast.promise with proper rejection handling
  toast.promise(
    // First argument should be a promise
    axios.post('/api/auth/login', {
      username: user.username,
      password: user.password
    }),
    {
      pending: "...wait",
      success: 'Success',
      error: `...check username or password`
    }
  )
  .then((response) => {
    // Access data properly from the response
    const data = response.data;
    console.log(data);

    if (data && data._id) {
      ctxDispatch({ type: "SET_USER", payload: data });
      router.push('/dashboard');
    }
  })
  .catch((error) => {
    // This catch will now properly handle the axios error response
    if (error.response) {
      // Handle server errors (non-2xx status code)
      console.error('Server responded with:', error.response.data);
    } else if (error.request) {
      // Handle network errors (request was made but no response received)
      console.error('No response received:', error.request);
    } else {
      // Handle errors during request setup
      console.error('Error during request setup:', error.message);
    }
  });
};


  

  return (
     <Container fluid='md' 
      className="col-md-4 d-flex justify-content-center align-items-center" style={{height: '100vh'}}>
      <Form className="w-100 border rounded p-3 shadow-sm" onSubmit={handleSubmit}>
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
