"use client";

import Calender from "@/app/components/Calender";
import XlsExportButton from "@/app/components/XlsExportButon";
import { useCallback } from "react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {toast} from 'react-toastify'
import {
  Container,
  ButtonToolbar,
  Col,
  Row,
  Form,
  ButtonGroup,
  Table,
  Button,
} from "react-bootstrap";
import { round2 } from "../../utils";

const CustomerLedger = () => {
  const [ledgers, setLedgers] = useState([]);
  const [limit, setLimit] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [date, setDate] = useState({
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
  });

  const getData = useCallback(
    async (query) => {
      const { data } = await axios.get(
        `/api/reports/customer-ledger-general?startDate=${date.startDate}&endDate=${date.endDate}&limit=${limit}&searchQuery=${query}`
      );
      //console.log(data)
      setLedgers(data);
    },
    [date.startDate, date.endDate, limit, searchQuery]
  );

  useEffect(() => {
    if (!searchQuery) {
      getData("");
      return;
    }

    const timeoutId = setTimeout(() => {
      getData(searchQuery);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, getData]);

  useEffect(() => {
    getData(searchQuery);
  }, [date.startDate, date.endDate, limit, searchQuery]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };


  const handlePrint = async () => {
  if (!window.confirm("Print Ledger Report?")) return;

  try {
    // wrap the axios promise directly
    const response = await toast.promise(
      axios.post(
        `/api/print/report`,
        { ledgers, reportType: 'CUSTOMER LEDGER' },
        { responseType: "blob" }
      ),
      {
        pending: "Generating PDF...",
        success: "PDF ready!",
        error: "Failed to generate PDF"
      }
    );

    // create blob
    const blob = new Blob([response.data], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);
    window.open(url, "_blank");
  } catch (err) {
    console.error("Print error:", err);
  }
};


  const ledgerData = Array.isArray(ledgers) ? ledgers : [ledgers];
  return (
    <Container fluid>
      <h1>Customer Ledger</h1>
      <Row className="bg-light border py-1">
        <Col className="col-md-2">
          <Form.Group>
            <Form.Select onChange={(e) => setLimit(e.target.value)}>
              <option>--entries--</option>
              {[5, 10, 100, 150, 200, 250, 500].map((x, index) => (
                <option key={index} value={x}>
                  {x}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
        <Col className="col-md-2">
          <Form.Control
            type="date"
            value={date.startDate}
            onChange={(e) =>
              setDate((prevDate) => ({
                ...prevDate,
                startDate: e.target.value,
              }))
            }
          />
        </Col>
        <Col className="col-md-2">
          <Form.Control
            type="date"
            value={date.endDate}
            onChange={(e) =>
              setDate((prevDate) => ({
                ...prevDate,
                endDate: e.target.value,
              }))
            }
          />
        </Col>
        <Col className="col-md-3">
          <Form.Control
            type="text"
            placeholder="name, phone, controlNo"
            aria-describedby="addon1"
            value={searchQuery}
            onChange={handleSearch}
          />
        </Col>
        <Col className="col-xs-12">
          <ButtonGroup>
            <Button size="md" variant="outline-danger">
              RESET
            </Button>
            <Button size="md" variant="outline-warning">
              SEARCH
            </Button>
            <Button size="md" variant="outline-success">
              EXCEL
            </Button>
            <Button size="md" onClick={()=>handlePrint()}>PRINT</Button>
          </ButtonGroup>
        </Col>
        <Col>
          <Button
            variant="danger"
            onClick={(e) => {
              if (window.confirm("Confirm Create New Customer?")) {
                window.location.href = "/dashboard/Customer/AddCustomer";
              }
            }}
          >
            create+
          </Button>
        </Col>
      </Row>

      <Table striped="columns" bordered hover className="m-2">
        <thead>
          <tr>
            <th>#</th>
            <th>Date</th>
            <th>Particulars</th>
            <th>Voucher Type</th>
            <th>Debit</th>
            <th>Credit</th>
            <th>Balance</th>
          </tr>
        </thead>
        <tbody>
          {ledgerData.map((entry, index) =>
            entry.entries.map((ledger, ledgerIndex) => (
              <tr key={`${index}-${ledgerIndex}`}>
                <td>{ledgerIndex + 1}</td>
                <td>{new Date(ledger.date).toDateString()}</td>
                <td>{ledger.particulars}</td>
                <td>{ledger.docVoucherType}</td>
                <td>{round2(ledger.debit)}</td>
                <td>{round2(ledger.credit)}</td>
                <td>{round2(ledger.balance)}</td>
              </tr>
            ))
          )}
        </tbody>
        <tfoot>
          {ledgerData.map((entry, index) => (
            <tr key={`total-${index}`} className="border text-danger">
              <th colSpan={4}>Totals</th>
              <td className="text-danger">{round2(entry.totalDebit)}</td>
              <td className="text-danger">{round2(entry.totalCredit)}</td>
              <td className="text-danger">{round2(entry.balance)}</td>
            </tr>
          ))}
          <tr>
            <th colSpan={3}>Total Advance Given</th>
            <th colSpan={3}>Total Advance Used</th>
            <th colSpan={3}>Total Advance Balance</th>
          </tr>
          <tr>
            <td className="text-danger" colSpan={3}>
              0.00
            </td>
            <td className="text-danger" colSpan={3}>
              0.00
            </td>
            <td className="text-danger" colSpan={3}>
              0.00
            </td>
          </tr>
        </tfoot>
      </Table>
    </Container>
  );
};

export default CustomerLedger;
