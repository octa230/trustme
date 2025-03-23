'use client'

import React, { useEffect, useState } from 'react'
import { Button, Form, Container, Badge, Table, Modal, Stack } from 'react-bootstrap'
import { toast } from 'react-toastify'
import axios from 'axios'

const ExpensesList =()=> {
  const [accGroups, setAccGroups] = useState([]);
  const [selectedAcc, setSelectedAcc] = useState({});
  const [showModal, setShowModal] = useState(false)
  const [account, setAccount] = useState({ name: "", accountGroup: "" });
  const [accounts, setAccounts] = useState([]);

  // Fetch Account Groups
  const getData = async () => {
    try {
      const [groupsRes, acctsRes] = await Promise.all([
        axios.get(`/api/accounts/groups`),
        axios.get(`/api/accounts/`)
      ])
      setAccGroups(groupsRes.data);
      setAccounts(acctsRes.data);
    } catch (error) {
      console.error("Error fetching account groups:", error);
      toast.error("Failed to fetch account groups.");
    }
  };

  // Handle Select Change (Parse JSON)
  const handleSelectAcc = (value) => {
    const selected = JSON.parse(value);
    setSelectedAcc(selected);
    console.log(selected)
  };

  // Update account state when selectedAcc changes
  useEffect(() => {
    setAccount((prev) => ({
      ...prev,
      accountGroup: selectedAcc._id || "" ,
      //name: "",
      //type: selectedAcc.type || ""
    }));
  }, [selectedAcc]);

  useEffect(() => {
    getData();
  }, []);

  // Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!account.accountGroup || account.name.length < 2) {
      toast.error("Select & Add Name To Proceed");
      return;
    }

    if (window.confirm(`Complete Account Creation?`)) {
      console.log("Submitting Account:", account);
      try {
        await axios.post(`/api/accounts`, {
          name: account.name,
          //type: account.accType,
          accountGroup: selectedAcc._id
        });
        toast.success("Account created successfully!");
      } catch (error) {
        console.error("Error creating account:", error);
        toast.error("Failed to create account.");
      }
    }
  };

  return (
    <Container fluid>
      <div>
      <h1>Ledger</h1>
      <Button onClick={()=> setShowModal(true)}>ADD EXPENSE</Button>
      </div>
      <hr />
      <Table bordered>
        <thead>
          <tr>
            <th>SERIAL</th>
            <th>ACCOUNT GROUP</th>
            <th>CONTROL ID</th>
            <th>ACCOUNT NAME</th>
            <th>ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {accounts.map((account)=> (
            <tr key={account._id}>
              <td>{account.serialNumber}</td>
              <td>{account.groupName}</td>
              <td>{account.controlId}</td>
              <td>{account.name}</td>
              <td>
                <Stack>
                  <Button className='btn btn-sm' variant=''>🖊️</Button>
                  <Button className='btn btn-sm' variant='light'>❌</Button>
                </Stack>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

    <Modal show={showModal} onHide={()=> setShowModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>NEW ACCOUNT</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit} className='p-2'>
        {/* Display Account Type */}
        <Badge pill className="fw-bold bg-success p-2">{account.typeName?.toUpperCase()}</Badge>

        {/* Name Field */}
        <Form.Group className="mb-3">
          <Form.Label>Name</Form.Label>
          <Form.Control 
            value={account.name || ''} 
            onChange={(e) => setAccount((prev) => ({ ...prev, name: e.target.value }))}
          />
        </Form.Group>

        {/* Account Type Dropdown */}
        <Form.Group className="mb-3">
          <Form.FloatingLabel>Account Type</Form.FloatingLabel>
          <Form.Select onChange={(e) => handleSelectAcc(e.target.value)}>
            <option value="">--Select Account Type--</option>
            {accGroups.map((accGroup) => (
              <option key={accGroup._id} value={JSON.stringify(accGroup)}>
                {accGroup.name}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
        <Modal.Footer>
        <Button type="submit" className="my-2">DONE</Button>
        <Button onClick={()=> setShowModal(false)} className="my-2" variant='danger'>CANCEL</Button>
        </Modal.Footer>
      </Form>
    </Modal>
    </Container>

  );
}

export default ExpensesList