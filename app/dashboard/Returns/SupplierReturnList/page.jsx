'use client'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Button, Stack, Table } from 'react-bootstrap'

const SupplierRetruns =()=> {
  const [returns, setReturns] = useState([])

  useEffect(()=>{
      const getData=async()=>{
        const {data} = await axios.get(`/api/return/suppliers`)
        setReturns(data)
      }
      getData()
  }, [])
  return (
    <div>
      <h1>Supplier Return List</h1>

      <Table bordered>
        <thead>
          <tr>
            <th>#</th>
            <th>RTN-NO</th>
            <th>RTN-DATE</th>
            <th>INV-NO</th>
            <th>SUPPLIER NAME</th>
            <th>ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {returns.map((item, index)=> (
            <tr key={item._id}>
              <td>{index + 1}</td>
              <td>{item.returnNo}</td>
              <td>{new Date(item.createdAt).toDateString()}</td>
              <td>{item['originalDocument'].documentNo}</td>
              <td>{item.partyName}</td>
              <td>
                <Stack direction='horizontal' gap={2}>
                  <Button>Edit</Button>
                  <Button variant='danger'>Del</Button>
                </Stack>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  )
}

export default SupplierRetruns