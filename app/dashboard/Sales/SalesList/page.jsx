"use client";

import { round2 } from "../../utils";
import {
  Container,
  ButtonToolbar,
  Col,
  Row,
  Form,
  ButtonGroup,
  Button,
  Table,
  InputGroup,
  Stack,
  Badge,
  Modal,
} from "react-bootstrap";
import React, { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import debounce from "lodash.debounce";

export default function SaleListPage() {
  const [sales, setSales] = useState([]);
  const [limit, setLimit] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSale, setSelectedSale] = useState({});
  const [selectedCustomer, setSelectedCustomer] = useState({});
  const [status, setStatus] = useState("");
  const [customers, setCustomers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [date, setDate] = useState({
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
  });

  const getSales = async (query) => {
    const { data } = await axios.get(
      `/api/sales?startDate=${date.startDate}&endDate=${date.endDate}&limit=${limit}&searchQuery=${searchQuery}`
    );
    setSales(data);
  };
  
  useEffect(() => {
    getSales();
  }, [date.startDate, date.endDate, limit, searchQuery]);

  const handlePrintSale = async (invoiceNo, controlId, customerId) => {
    if (window.confirm(`Print Invoice ${invoiceNo}`)) {
      toast.promise(
        axios
          .post(
            `/api/print/invoice/${invoiceNo}/${controlId}/${customerId}`,
            {},
            { responseType: "blob" }
          )
          .then((response) => {
            const blob = new Blob([response.data], { type: "application/pdf" });
            const url = window.URL.createObjectURL(blob);
            window.open(url, "_blank");
          }),
        {
          pending: "...wait",
          success: "Success",
          error: "Failed to Print Invoice",
        }
      );
    }
  };

  const handlePreview = async (invoiceNo, controlId, customerId) => {
    const { data } = await axios.get(
      `/api/sales/${invoiceNo}/${controlId}/${customerId}`
    );
    setSelectedSale(data);
    console.log(data);
    setShowModal(true);
  };

  const debounceSearch = useRef(
    debounce((query) => {
      getSales(query);
    }, 500 ),
    []
  ).current;

  const handleSearch=(e)=>{
    const value = e.target.value
    setSearchQuery(value)
    debounceSearch(value)
  }

  useEffect(() => {
    return () => {
      debouncedGetSales.cancel();
    };
  }, []);




  return (
    <Container fluid>
      <h1>Invoice/Sales List</h1>
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
          <InputGroup>
            <Form.Control
              type="text"
              placeholder="customer, invoiceNo, controlNo "
              aria-describedby="addon1"
              value={searchQuery}
              onChange={handleSearch}
            />
            <Button id="addon1" variant="outline-dark">
              x
            </Button>
          </InputGroup>
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
            <Button size="md">PRINT</Button>
          </ButtonGroup>
        </Col>
        <Col>
          <Button
            variant="danger"
            onClick={(e) => {
              if (
                window.confirm("Are you sure you want to add a new invoice?")
              ) {
                window.location.href = "/dashboard/Sales";
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
            <th>CtrID</th>
            <th>Inv No</th>
            <th>Date</th>
            <th>Customer</th>
            <th>Net Amt</th>
            <th>Grand TT</th>
            <th>Cash Paid</th>
            <th>Card Paid</th>
            <th>Bank Paid</th>
            <th>Paid Amt</th>
            <th>Pending Amt</th>
            <th>Status</th>
            <th>Files</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sales &&
            sales?.map((sale, index) => (
              <tr key={sale.controlId}>
                <td>{index}</td>
                <td>{sale.controlId}</td>
                <td>
                  <Badge pill>{sale.invoiceNo}</Badge>
                </td>
                <td>{new Date(sale.createdAt).toLocaleDateString()}</td>
                <td>{sale?.customerName}</td>
                <td>{sale?.totalWithoutVat}</td>
                <td>{sale?.totalAfterDiscount}</td>
                <td>{sale?.cashAmount}</td>
                <td>{sale?.cardAmount}</td>
                <td>{sale?.bankAmount}</td>
                <td>{sale?.paidAmount}</td>
                <td>{sale?.pendingAmount}</td>
                <td>{sale?.status}</td>
                <td>x days</td>
                <td>
                  <Stack gap={2}>
                    <Button
                      onClick={() =>
                        handlePreview(
                          sale.invoiceNo,
                          sale.controlId,
                          sale.customerId
                        )
                      }
                      variant="outline-info btn-sm"
                    >
                      👆
                    </Button>
                    <Button
                      variant="outline-success btn-sm"
                      onClick={() =>
                        handlePrintSale(
                          sale.invoiceNo,
                          sale.controlId,
                          sale.customerId
                        )
                      }
                    >
                      🖨
                    </Button>
                    <Button variant="outline-danger btn-sm">❌</Button>
                  </Stack>
                </td>
              </tr>
            ))}
        </tbody>
        <tfoot>
          <tr>
            <th colSpan={5}>Totals</th>
            <td>
              {round2(
                sales.reduce((acc, sale) => acc + sale.totalWithoutVat, 0)
              )}
            </td>
            <td>
              {round2(
                sales.reduce((acc, sale) => acc + sale.totalAfterDiscount, 0)
              )}
            </td>
            <td>
              {round2(sales.reduce((acc, sale) => acc + sale.cashAmount, 0))}
            </td>
            <td>
              {round2(sales.reduce((acc, sale) => acc + sale.cardAmount, 0))}
            </td>
            <td>
              {round2(sales.reduce((acc, sale) => acc + sale.bankAmount, 0))}
            </td>
            <td>
              {round2(sales.reduce((acc, sale) => acc + sale.paidAmount, 0))}
            </td>
            <td>
              {round2(sales.reduce((acc, sale) => acc + sale.pendingAmount, 0))}
            </td>
          </tr>
        </tfoot>
      </Table>
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Invoice Preview</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            {/* Invoice Structure */}
            <header className="header">
              <div className="company-info">
                <div className="company-name">{selectedSale.company?.name}</div>
                <div className="company-details">
                  PO Box: {selectedSale.company?.poBox} |
                  {selectedSale.company?.phone} |{selectedSale.company?.email}
                  <br />
                  {selectedSale.company?.address},{" "}
                  {selectedSale.company?.region} | TRN:{" "}
                  {selectedSale.company?.trn}
                </div>
              </div>
              <div className="logo-container">
                <img
                  className="logo"
                  style={{ width: 100, height: 100 }}
                  src="https://res.cloudinary.com/drovqqnv7/image/upload/v1741761113/WhatsApp_Image_2024-06-18_at_11.01.53_sjff5x.jpg"
                  alt="Company Logo"
                />
              </div>
            </header>

            <div className="document-title">
              <h1>TAX INVOICE</h1>
              <div className="trn">
                Invoice #: {selectedSale.sale?.invoiceNo} |
                {selectedSale.sale?.date
                  ? selectedSale.sale.date
                  : selectedSale.sale?.createdAt}
              </div>
            </div>

            <div className="info-section">
              <div className="client-info">
                <div className="section-title">BILL TO</div>
                <div>
                  <strong>{selectedSale.customer?.name}</strong>
                </div>
                <div>{selectedSale.customer?.address}</div>
                <div>{selectedSale.customer?.phone}</div>
                <div>VAT No: {selectedSale.customer?.trn}</div>
              </div>

              <div className="invoice-info">
                <div className="section-title">DETAILS</div>
                <div>
                  <strong>Control No:</strong> {selectedSale.sale?.controlId}
                </div>
                <div>
                  <strong>Due Date:</strong> 45days
                </div>
                <div>
                  <strong>Delivery Note:</strong>{" "}
                  {selectedSale.sale?.deliveryNote}
                </div>
                <div>
                  <strong>PO No:</strong>{" "}
                  {selectedSale.sale?.purchaseOrderNumber}
                </div>
              </div>
            </div>

            <table className="invoice-table">
              <thead>
                <tr>
                  <th className="text-left" style={{ width: "40%" }}>
                    Description
                  </th>
                  <th className="text-center">Unit</th>
                  <th className="text-center">Qty</th>
                  <th className="text-center">Price</th>
                  <th className="text-center">VAT</th>
                  <th className="text-center">Total</th>
                </tr>
              </thead>
              <tbody>
                {selectedSale.transaction?.items?.map((item, index) => (
                  <tr key={index}>
                    <td className="text-left">
                      {item.name}
                      {item.description && (
                        <div className="item-description">
                          {item.description}
                        </div>
                      )}
                    </td>
                    <td className="text-center">{item.unit}</td>
                    <td className="text-center">{item.qty}</td>
                    <td className="text-center">{item.salePrice}</td>
                    <td className="text-center">{item.vat}</td>
                    <td className="text-center">{item.total}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="totals-table">
                <tr>
                  <td className="text-left">Subtotal</td>
                  <td className="text-right">
                    {selectedSale.sale?.totalWithoutVat}
                  </td>
                </tr>
                <tr>
                  <td className="text-left">Discount</td>
                  <td className="text-right">
                    {selectedSale.sale?.discountAmount}
                  </td>
                </tr>
                <tr>
                  <td className="text-left">
                    Tax ({selectedSale.sale?.vatRate}%)
                  </td>
                  <td className="text-right">{selectedSale.sale?.vatAmount}</td>
                </tr>
                <tr>
                  <td className="text-left">Total</td>
                  <td className="text-right">
                    {selectedSale.sale?.totalAfterDiscount}
                  </td>
                </tr>
                <tr>
                  <td className="text-left">Amount Paid</td>
                  <td className="text-right">
                    {selectedSale.sale?.paidAmount}
                  </td>
                </tr>
                <tr>
                  <td className="text-left">Balance Due</td>
                  <td className="text-right">
                    {selectedSale.sale?.pendingAmount}
                  </td>
                </tr>
              </tfoot>
            </table>

            <div className="amount-in-words">
              <strong>Amount in words:</strong>{" "}
              {selectedSale.sale?.amountInWords}
            </div>

            <footer className="footer">
              <div className="footer-title">TERMS</div>
              <div className="terms">
                <div>
                  <div>• Payment due in 45 days upon receipt</div>
                  <div>• Please reference invoice number when paying</div>
                </div>
                <div className="footer-verification footer-title">
                  FOR {selectedSale.company?.name}
                </div>
              </div>

              <div className="signature">
                <div className="footer-title">AUTHORIZED SIGNATURE</div>
                <div className="signature-line"></div>
              </div>

              <small className="footnote">
                This is a system-generated Invoice, present control number
                [controlNo] for any resolutions
              </small>
            </footer>
          </div>
        </Modal.Body>
      </Modal>
    </Container>
  );
}
