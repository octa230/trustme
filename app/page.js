"use client"
import { Button, Container, Form } from 'react-bootstrap'
import { useRouter } from "next/navigation";



export default function Home() {

  const router = useRouter()

const handleSubmit = ()=>{
  router.push('dashboard')
}

  return (
     <Container fluid='md' className="col-md-4 d-flex justify-content-center align-items-center" style={{height: '100vh'}}>
      <Form className="w-100 border p-3 bg-light">
        <h3 className='text-muted'>BUSINESS SOFTWARE SYSTEM</h3>
        <Form.Group>
          <Form.Label>USERNAME</Form.Label>
          <Form.Control type='text'/>
          </Form.Group>
          <Form.Group>
          <Form.Label>PASSWORD</Form.Label>
          <Form.Control type='password'/>
        </Form.Group>
        <Button variant="success" type="submit" className="my-3 w-100" onClick={handleSubmit}>LOG IN</Button>
      </Form>
    </Container>
  );
}
