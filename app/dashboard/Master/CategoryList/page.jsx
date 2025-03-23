'use client'

import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Button, Stack, Table } from 'react-bootstrap'

const CategoryList=()=> {

  const [categories, setCategories] = useState([])

  useEffect(()=>{
    const getData = async()=>{
      const {data} = await axios.get(`/api/category`)
      setCategories(data)
    }
    getData()
  }, [])





  return (
    <div>
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
                <Stack gap={2}>
                  <Button className='btn-sm my-1'>edit</Button>
                  <Button className='btn-sm' variant='danger'>Del</Button>
                </Stack>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  )
}


export default CategoryList