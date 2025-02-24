'use client'

import React from 'react'
import 'chart.js/auto'
import dynamic from 'next/dynamic'
import { Col } from 'react-bootstrap'


const PieChart = dynamic(()=> import('react-chartjs-2').then((mod)=> mod.Pie), {ssr: false})

const PendingsChart = () => {
    const data = {
        labels: ['Recievables', 'Payments'],
        datasets: [
          {
            label: 'Recievables & Payment Bar Chart',
            data: [120, 19],
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',

            ],
             borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
            ], 
            borderWidth: 1,
            hoverOffset: 4
          },
        ],
      };
  return (
    <Col className='col-md-4'>
      <PieChart data={data}/>
    </Col>
  )
}

export default PendingsChart
