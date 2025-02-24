'use client'

import { Container, Row, Col, Card } from "react-bootstrap";
import 'chart.js/auto'
import dynamic from "next/dynamic";

const LineChart = dynamic(()=> import('react-chartjs-2').then((mod)=> mod.Line), {ssr: false})


const RevenueChart = () => {

    const data = {
        labels: ['January', 'February', 'March', 'April', 'May'],
        datasets: [
          {
            label: 'Dummy data Line Chart',
            data: [65, 59, 80, 81, 56],
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1,
          },
        ],
    };

  return (
    <Col className="col-md-8">
        <h1>Revenue Chart</h1>
        <LineChart data={data}/>
    </Col>
  )
}

export default RevenueChart
