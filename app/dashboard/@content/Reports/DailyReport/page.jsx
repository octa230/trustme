'use client'

import Calender from '@/app/components/Calender'
import React from 'react'
import {Container, ButtonToolbar, Col, Row, Form, 
  ButtonGroup, Table, Button } from 'react-bootstrap'

export default function page() {
  return (
    <>
    <Row className='bg-light p-3 border align-content-center'>
    <ButtonToolbar className='mb-2'>
      <Col className='col-md-2'>
      <Calender title='FromDate'/>
      </Col>
      <Col className='mx-1 col-md-2'>
        <Calender title='EndDate'/>
      </Col>
      <Col>
      <Col className='m-1 col-xs-12'>
        <ButtonGroup>
          <Button size='md' variant='outline-danger'>RESET</Button>
          <Button size='md' variant='outline-warning'>SEARCH</Button>
          <Button size='md'>PRINT</Button>
        </ButtonGroup>
      </Col>
      </Col>
    </ButtonToolbar>
    </Row>
    <Row className='mb-3'>
      <h4 className='text-center text-muted'>INVOICES</h4>
      <Table striped='columns' bordered hover className='m-2'>
    <thead className='table-dark'>
      <tr>
        <th>#</th>
        <th>ctrID</th>
        <th>SaleDate</th>
        <th>Invoice Nō</th>
        <th>Customer name</th>
        <th>Total Amount</th>
      </tr>
    </thead>
    <tbody></tbody>
    <tfoot>
        <tr className='border'>
          <th colSpan={4}></th>
          <th>Total</th>
          <td className='text-danger'>0.00</td>
        </tr>
    </tfoot>
  </Table>
  </Row>
    <Row className='mb-3'>
      <h4>PURCHASE</h4>
      <Table striped='columns' bordered hover className='m-2'>
    <thead className='table-dark'>
      <tr>
        <th>#</th>
        <th>ctrID</th>
        <th>PurchaseDate</th>
        <th>Purchase Nō</th>
        <th>Supplier Name</th>
        <th>Total Amount</th>
      </tr>
    </thead>
    <tbody></tbody>
    <tfoot>
        <tr className='border'>
          <th colSpan={4}></th>
          <th>Total</th>
          <td className='text-danger'>0.00</td>
        </tr>
    </tfoot>
  </Table>
  </Row>
    <Row className='mb-3'>
      <h4 className='text-muted text-center'>CUSTOMER ADVANCE</h4>
      <Table striped='columns' bordered hover className='m-2'>
    <thead className='table-dark'>
      <tr>
        <th>#</th>
        <th>ctrID</th>
        <th>X Date</th>
        <th>Recipet Nō</th>
        <th>Customer name</th>
        <th>Advance Amount</th>
      </tr>
    </thead>
    <tbody></tbody>
    <tfoot>
        <tr className='border'>
          <th colSpan={4}></th>
          <th>Total</th>
          <td className='text-danger'>0.00</td>
        </tr>
    </tfoot>
  </Table>
  </Row>
    <Row className='mb-3'>
      <h4 className='text-muted text-center'>SUPPLIER ADVANCE</h4>
      <Table striped='columns' bordered hover className='m-2'>
    <thead className='table-dark'>
      <tr>
        <th>#</th>
        <th>ctrID</th>
        <th>Payment Date</th>
        <th>Reciept Nō</th>
        <th>Supplier name</th>
        <th>Advance Amount</th>
      </tr>
    </thead>
    <tbody></tbody>
    <tfoot>
        <tr className='border'>
          <th colSpan={4}></th>
          <th>Total Vat</th>
          <td className='text-danger'>0.00</td>
        </tr>
    </tfoot>
  </Table>
  </Row>
    <Row className='mb-3'>
      <h4 className='text-muted text-center'>SALES RETURN</h4>
      <Table striped='columns' bordered hover className='m-2'>
    <thead className='table-dark'>
      <tr>
        <th>#</th>
        <th>ctrID</th>
        <th>Return Date</th>
        <th>Reciept Nō</th>
        <th>Customer Name</th>
        <th>Return Amount</th>
      </tr>
    </thead>
    <tbody></tbody>
    <tfoot>
        <tr className='border'>
          <th colSpan={4}></th>
          <th>Total</th>
          <td className='text-danger'>0.00</td>
        </tr>
    </tfoot>
  </Table>
  </Row>
    <Row className='mb-3'>
      <h4 className='text-muted text-center'>PURCHASE RETURN</h4>
      <Table striped='columns' bordered hover className='m-2'>
    <thead className='table-dark'>
      <tr>
        <th>#</th>
        <th>ctrID</th>
        <th>Return Date</th>
        <th>Reciept Nō</th>
        <th>Supplier Name</th>
        <th>Return Amount</th>
      </tr>
    </thead>
    <tbody></tbody>
    <tfoot>
        <tr className='border'>
          <th colSpan={4}></th>
          <th>Total</th>
          <td className='text-danger'>0.00</td>
        </tr>
    </tfoot>
  </Table>
  </Row>
    <Row className='mb-3'>
      <h4 className='text-muted text-center'>CUSTOMER PAYMENT</h4>
      <Table striped='columns' bordered hover className='m-2'>
    <thead className='table-dark'>
      <tr>
        <th>#</th>
        <th>ctrID</th>
        <th>Payment Date</th>
        <th>Reciept Nō</th>
        <th>Customer Name</th>
        <th>Amount</th>
      </tr>
    </thead>
    <tbody></tbody>
    <tfoot>
        <tr className='border'>
          <th colSpan={4}></th>
          <th>Total</th>
          <td className='text-danger'>0.00</td>
        </tr>
    </tfoot>
  </Table>
  </Row>
    <Row className='mb-3'>
      <h4 className='text-muted text-center'>SUPPLIER PAYMENT</h4>
      <Table striped='columns' bordered hover className='m-2'>
    <thead className='table-dark'>
      <tr>
        <th>#</th>
        <th>ctrID</th>
        <th>Payment Date</th>
        <th>Reciept Nō</th>
        <th>Supplier Name</th>
        <th>Amount</th>
      </tr>
    </thead>
    <tbody></tbody>
    <tfoot>
        <tr className='border'>
          <th colSpan={4}></th>
          <th>Total</th>
          <td className='text-danger'>0.00</td>
        </tr>
    </tfoot>
  </Table>
  </Row>
    <Row className='mb-3'>
      <h4 className='text-center'>COMPANY EXPENSES</h4>
      <Table striped='columns' bordered hover className='m-2'>
    <thead className='table-dark'>
      <tr>
        <th>#</th>
        <th>ctrID</th>
        <th>Date</th>
        <th>Voucher Nō</th>
        <th>Expense Name</th>
        <th>username</th>
        <th>Expense Total</th>
      </tr>
    </thead>
    <tbody></tbody>
    <tfoot>
        <tr className='border'>
          <th colSpan={5}></th>
          <th>Total</th>
          <td className='text-danger'>0.00</td>
        </tr>
    </tfoot>
  </Table>
  </Row>
  <Row>
    <Col>
      <strong className='text-success'>Total</strong>
    </Col>
    <Col>
      <p className='text-success'>0.00</p>
    </Col>
  </Row>
    </>
  )
}
