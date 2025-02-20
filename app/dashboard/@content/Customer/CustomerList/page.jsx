'use client'

import axios from 'axios'
import React, { useEffect } from 'react'

export default function page() {

  useEffect(()=>{
    const getCustomers = async()=>{
      try{
        const {data} = await axios.get('/api/customers')

        console.log(data)
      }catch(error){
        console.log(error)
      }
    }
    getCustomers()
  }, [])

  return (
    <div>
      <h1>Customer List</h1>
    </div>
  )
}
