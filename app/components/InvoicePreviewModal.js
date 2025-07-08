import React from 'react';
import { Modal } from 'react-bootstrap';

const InvoicePreviewModal = ({ showModal, setShowModal, selectedSale }) => {
  if (!selectedSale) return null; // In case selectedSale is null or undefined

  return (
    <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
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
                {selectedSale.company?.phone} | 
                {selectedSale.company?.email}<br />
                {selectedSale.company?.address}, {selectedSale.company?.region} | 
                TRN: {selectedSale.company?.trn}
              </div>
            </div>
            <div className="logo-container">
              <img className="logo" src={selectedSale.company?.logo} alt="Company Logo" />
            </div>
          </header>

          <div className="document-title">
            <h1>TAX INVOICE</h1>
            <div className="trn">
              Invoice #: {selectedSale.sale?.invoiceNo} | 
              {selectedSale.sale?.date ? selectedSale.sale.date : selectedSale.sale?.createdAt}
            </div>
          </div>

          <div className="info-section">
            <div className="client-info">
              <div className="section-title">BILL TO</div>
              <div><strong>{selectedSale.customer?.name}</strong></div>
              <div>{selectedSale.customer?.address}</div>
              <div>{selectedSale.customer?.phone}</div>
              <div>VAT No: {selectedSale.customer?.trn}</div>
            </div>

            <div className="invoice-info">
              <div className="section-title">DETAILS</div>
              <div><strong>Control No:</strong> {selectedSale.sale?.controlId}</div>
              <div><strong>Due Date:</strong> 45days</div>
              <div><strong>Delivery Note:</strong> {selectedSale.sale?.deliveryNote}</div>
              <div><strong>PO No:</strong> {selectedSale.sale?.purchaseOrderNumber}</div>
            </div>
          </div>

          <table className="invoice-table">
            <thead>
              <tr>
                <th className="text-left" style={{ width: '40%' }}>Description</th>
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
                    {item.description && <div className="item-description">{item.description}</div>}
                  </td>
                  <td className="text-center">{item.unit}</td>
                  <td className="text-center">{item.qty}</td>
                  <td className="text-center">{item.salePrice}</td>
                  <td className="text-center">{item.vat}</td>
                  <td className="text-center">{item.total}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="totals-section">
            <table className="totals-table">
              <tr>
                <td className="text-left">Subtotal</td>
                <td className="text-right">{selectedSale.sale?.totalWithoutVat}</td>
              </tr>
              <tr>
                <td className="text-left">Discount</td>
                <td className="text-right">{selectedSale.sale?.discountAmount}</td>
              </tr>
              <tr>
                <td className="text-left">Tax ({selectedSale.sale?.vatRate}%)</td>
                <td className="text-right">{selectedSale.sale?.vatAmount}</td>
              </tr>
              <tr>
                <td className="text-left">Total</td>
                <td className="text-right">{selectedSale.sale?.totalAfterDiscount}</td>
              </tr>
              <tr>
                <td className="text-left">Amount Paid</td>
                <td className="text-right">{selectedSale.sale?.paidAmount}</td>
              </tr>
              <tr>
                <td className="text-left">Balance Due</td>
                <td className="text-right">{selectedSale.sale?.pendingAmount}</td>
              </tr>
            </table>
          </div>

          <div className="amount-in-words">
            <strong>Amount in words:</strong> {selectedSale.sale?.amountInWords}
          </div>

          <footer className="footer">
            <div className="footer-title">TERMS</div>
            <div className="terms">
              <div>
                <div>• Payment due in 45 days upon receipt</div>
                <div>• Please reference invoice number when paying</div>
              </div>
              <div className="footer-verification footer-title">FOR {selectedSale.company?.name}</div>
            </div>

            <div className="signature">
              <div className="footer-title">AUTHORIZED SIGNATURE</div>
              <div className="signature-line"></div>
            </div>

            <small className="footnote">This is a system-generated Invoice, present control number [controlNo] for any resolutions</small>
          </footer>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default InvoicePreviewModal;
