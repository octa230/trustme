"use client"


import styles from "./page.module.css";
import { Button, Container, Form } from 'react-bootstrap'
import { useRouter } from "next/navigation";



export default function Home() {

  const router = useRouter()

const handleSubmit = ()=>{
  router.push('dashboard')
}

  return (
     <Container fluid='md' className="w-25">
      <Form className="w-100">
        <Form.Group>
          <Form.Text>LOG-IN</Form.Text>
          <Form.Label title='username'/>
          <Form.Control type='text'/>
          <Form.Label title='Password'/>
          <Form.Control type='password'/>
        </Form.Group>
        <Button variant="success" type="submit" className="my-3" onClick={handleSubmit}>LOG IN</Button>
      </Form>
    </Container>
  );
}
