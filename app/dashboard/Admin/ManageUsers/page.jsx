"use client";

import { useStore } from "@/app/Store";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import {
  Button,
  Col,
  Form,
  InputGroup,
  Modal,
  Row,
  Table,
} from "react-bootstrap";
import {
  LuAtSign,
  LuCheck,
  LuCircleCheck,
  LuCirclePause,
  LuCircleX,
  LuCog,
  LuLock,
  LuMail,
  LuPenLine,
  LuPhone,
  LuUser,
} from "react-icons/lu";
import { toast } from "react-toastify";

export default function page() {
  const { state } = useContext(useStore);
  const { userData } = state;

  const [users, setUsers] = useState([]);
  const [show, setShow] = useState(false);
  const [user, setUser] = useState({
    username: "",
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const getUsers = async () => {
      const { data } = await axios.get(`/api/users`);
      setUsers(data);
    };
    getUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (user.password !== user.confirmPassword) {
      toast.error("Passwords Dont match");
      return;
    }
    try {
      const { data } = await axios.post(`/api/users/admin`, user);
      setUsers([...users, data]);
    } catch (error) {
      toast.error(error);
      console.log(error);
    }
  };

  const handleDelete = async (userId, username) => {
    if (window.confirm(`Delete User ${username}?`)) {
      try {
        if (userId == userData._id) {
          toast.error("cant delete logged in user");
          return;
        }
        await axios.delete(`/api/users/admin/${userId}`);
        users.filter((user) => user._id !== userId);
        toast.success("user deleted");
      } catch (error) {
        toast.error(error);
        console.log(error);
      }
    }
  };

  const toggleStatus = async (userId, username) => {
    if (window.confirm(`Change User ${username} Status?`)) {
      try {
        if (userId == userData._id) {
          toast.error("cant disable logged in user");
          return;
        }
        const { data } = await axios.patch(`/api/users/disable/${userId}`);
        setUsers((prevData) =>
          prevData.map((item) => (item._id === data._id ? data : item))
        );
        toast.success("user deleted");
      } catch (error) {
        toast.error(error);
        console.log(error);
      }
    }
  };

  const toggleModal = ()=> setShow(true)
  
  const handleSelectUser =(userId)=>{
    toggleModal()
    setUser(prev => ({ ...prev, _id: userId }))
  }

  const updatePassword = async(e)=> {
    e.preventDefault()
    try {
      if (user.password !== user.confirmPassword) {
        toast.error("Passwords Dont match");
        return;
      }
      const {data} = await axios.patch(`/api/users/update-password/${user._id}`, {password: user.password});
      toast.success(data)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div>
      <h1>Manage Users</h1>
      <Row>
        <Col md={4}>
          <Form className="border rounded p-3" onSubmit={handleSubmit}>
            <Form.Text>
              <h4>Create User</h4>
            </Form.Text>
            <InputGroup className="mb-3">
              <InputGroup.Text id="user-addon">
                <LuUser />
              </InputGroup.Text>
              <Form.Control
                type="text"
                value={user.username}
                onChange={(e) => setUser({ ...user, username: e.target.value })}
                aria-describedby="user-addon"
                placeholder="username"
              />
            </InputGroup>
            <Form.Group>
              <Form.Control
                className="mb-3"
                type="text"
                placeholder="firstName"
                value={user.firstname}
                onChange={(e) =>
                  setUser({ ...user, firstname: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group>
              <Form.Control
                className="mb-3"
                type="text"
                value={user.lastname}
                onChange={(e) => setUser({ ...user, lastname: e.target.value })}
                placeholder="lastName"
              />
            </Form.Group>
            <InputGroup className="mb-3">
              <InputGroup.Text id="phone-addon">
                <LuPhone />
              </InputGroup.Text>
              <Form.Control
                type="text"
                value={user.phone}
                min={10}
                onChange={(e) => setUser({ ...user, phone: e.target.value })}
                aria-describedby="phone-addon"
                placeholder="phone"
              />
            </InputGroup>
            <InputGroup className="mb-3">
              <InputGroup.Text id="mail-addon">
                <LuMail />
              </InputGroup.Text>
              <Form.Control
                type="email"
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
                placeholder="email"
                aria-describedby="mail-addon"
              />
            </InputGroup>
            <InputGroup className="mb-3">
              <InputGroup.Text id="password-addon">
                <LuLock />
              </InputGroup.Text>
              <Form.Control
                type="text"
                value={user.password}
                onChange={(e) => setUser({ ...user, password: e.target.value })}
                placeholder="password"
                aria-describedby="password-addon"
              />
            </InputGroup>
            <InputGroup className="mb-3">
              <InputGroup.Text id="confirm-addon">
                <LuCircleCheck />
              </InputGroup.Text>
              <Form.Control
                type="password"
                value={user.confirmPassword}
                onChange={(e) =>
                  setUser({ ...user, confirmPassword: e.target.value })
                }
                placeholder="confirm password"
                aria-describedby="confirm-addon"
              />
            </InputGroup>

            <Button variant="success w-25" type="submit">
              save
            </Button>
          </Form>
        </Col>
        <Col md={8}>
          <Table bordered className="border" size="sm">
            <thead>
              <tr>
                <th>username</th>
                <th>Fname</th>
                <th>Lname</th>
                <th>phone</th>
                <th>
                  <LuAtSign />
                </th>
                <th>AccType</th>
                <th>Acctions</th>
              </tr>
            </thead>
            <tbody>
              {users?.map((user, index) => (
                <tr key={index} style={{background: user.disabled ? 'gray' : ''}}>
                  <td>{user.username}</td>
                  <td>{user.firstname}</td>
                  <td>{user.lastname}</td>
                  <td>{user.phone}</td>
                  <td>{user.email}</td>
                  <td>{user.isAdmin ? "ADMIN" : "BASIC"}</td>
                  <td className="d-flex gap-3 justify-content-between">
                    <LuCircleX
                      color="tomato"
                      onClick={() => handleDelete(user?._id, user.username)}
                    />
                    <LuPenLine color="blue" />
                    <LuCirclePause
                      color="grey"
                      onClick={() => toggleStatus(user._id, user.username)}
                    />
                    <LuCog color="grey" onClick={()=> handleSelectUser(user._id)}/>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>

      {/**UPDATE PASSWORD MODAL */}
      <Modal show={show} onHide={()=> setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{user?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={updatePassword}>
            <InputGroup className="mb-3">
              <InputGroup.Text id="password-addon">
                <LuLock />
              </InputGroup.Text>
              <Form.Control
                type="text"
                value={user.password}
                onChange={(e) => setUser({ ...user, password: e.target.value })}
                placeholder="password"
                aria-describedby="password-addon"
              />
            </InputGroup>
            <InputGroup className="mb-3">
              <InputGroup.Text id="confirm-addon">
                <LuCircleCheck />
              </InputGroup.Text>
              <Form.Control
                type="password"
                value={user.confirmPassword}
                onChange={(e) =>
                  setUser({ ...user, confirmPassword: e.target.value })
                }
                placeholder="confirm password"
                aria-describedby="confirm-addon"
              />
            </InputGroup>
            <Button type="submit" variant="success">save</Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}
