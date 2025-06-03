'use client'

import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Button, Form, Modal, ButtonGroup, Table } from 'react-bootstrap'
import { toast } from 'react-toastify'

const CategoryList=()=> {

  const [categories, setCategories] = useState([])
  const [openModal, setOpenModal] = useState(false)
  const [category, setCategory] = useState({
    _id:"",
    name:"",
    controlId:""
  })

  useEffect(()=>{
    const getData = async()=>{
      const {data} = await axios.get(`/api/category`)
      setCategories(data)
    }
    getData()
  }, [])

    const saveNewCategory = async()=> {
    //console.log(creatItem)
    const {data} = await axios.post('/api/category', {
        name: category.name
      })
        if(data){
          setCategories([...categories, {...data}])
        }
    }
    
    const updateCategory = async (cat) => {
  try {
    const { data } = await axios.put(`/api/category/${cat._id}`, {
      name: category.name,
    });

    if (data) {
      setCategories(prevCategories =>
        prevCategories.map(c =>
          c._id === cat._id ? data : c // You can use `{...c, name: category.name}` if `data` doesn't return full object
        )
      );
    }
    setOpenModal(false)
  } catch (error) {
    console.error("Error updating category:", error);
  }
};


    const deleteCategory =async(cat)=>{
      if(cat._id && window.confirm('Delete Category?')){
        setCategories(prevCategories=> prevCategories.filter(category => category._id !== cat._id))

        toast.promise(
        axios.delete(`/api/category/${cat._id}`),
        {
          pending:"...wait",
          success:"Done!",
          error: "Oops! Try again."
        }
      )
      }
      
    }

    const EditCategory=async(cat)=>{
      if(cat._id)
        setCategory({...cat})
        setOpenModal(true)
    }




  return (
    <div>
      <Button onClick={()=> setOpenModal(true)}>New</Button>
      <h1>Category List</h1>
      <Table striped='columns' bordered>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Files</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category, index)=>(
            <tr key={category._id}>
              <td>{index}</td>
              <td>{category.name}</td>
              <td>'NO FILES AVAILABLE'</td>
              <td>
                  <Button className='btn-sm m-1' onClick={()=> EditCategory(category)}>
                    🖊
                  </Button>
                  <Button className='btn-sm' variant='outline-danger' onClick={()=> deleteCategory(category)}>
                    Delete
                  </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Modal show={openModal} onHide={()=> setOpenModal(false)}>
        <Modal.Header closeButton>
          Create/Edit Category
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Control type='text'
              value={category.name}
              onChange={(e)=> setCategory(prevState => ({...prevState, name: e.target.value}))}
            />
            <ButtonGroup className='mt-2'>
              <Button type='submit' variant='success' onClick={(e)=>{
                e.preventDefault()
                saveNewCategory()
                setOpenModal(false)
              }}>
                Save New
              </Button>
              <Button variant='danger' onClick={()=> setOpenModal(false)}>
                Cancel
              </Button>
              <Button onClick={()=> updateCategory(category)}>
                Update 
            </Button>
            </ButtonGroup>

          </Form>
        </Modal.Body>
      </Modal>
    </div>
  )
}


export default CategoryList