import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { Table, Stack, Button, Form, Modal, InputGroup, ListGroup,ButtonGroup } from 'react-bootstrap'
import { createCalc, round2 } from '../dashboard/utils'
import { useStore } from '../Store'
import { toast } from 'react-toastify'

function PaymentMethodsSection({
  advance, advanceAmount, setAdvance, setAdvanceAmount,
  cash, cashAmount, setCash, setCashAmount,
  bank, bankAmount, bankName, banks, handleBankChange, setBank, setBankAmount,
  card, cardAmount, setCard, setCardAmount
}) {
  return (
    <>
      <tr>
        <td colSpan={3}>
          <strong>Payment Methods</strong>
        </td>
      </tr>
      
      {/* Advance Payment */}
      <tr>
        <td colSpan={3}>
          <InputGroup className="mb-2">
            {advance && (
              <Form.Control
                type="number"
                step="0.01"
                placeholder="0.00"
                value={advanceAmount}
                onChange={e => setAdvanceAmount(Number(e.target.value))}
              />
            )}
            <InputGroup.Checkbox
              checked={advance}
              onChange={e => setAdvance(e.target.checked)}
            />
            <InputGroup.Text>Advance Amount</InputGroup.Text>
          </InputGroup>
        </td>
      </tr>

      {/* Cash Payment */}
      <tr>
        <td colSpan={3}>
          <InputGroup className="mb-2">
            {cash && (
              <Form.Control
                type="number"
                step="0.01"
                placeholder="0.00"
                value={cashAmount}
                onChange={e => setCashAmount(Number(e.target.value))}
              />
            )}
            <InputGroup.Checkbox
              checked={cash}
              onChange={(e) => setCash(e.target.checked)}
            />
            <InputGroup.Text>Cash</InputGroup.Text>
          </InputGroup>
        </td>
      </tr>

      {/* Bank Payment */}
      <tr>
        <td colSpan={3}>
          <InputGroup className="mb-2">
            {bank && (
              <>
                <Form.Select
                  title={bankName || 'SELECT BANK'}
                  variant="danger"
                  onChange={(e) => handleBankChange(e)}
                >
                  <option>{bankName || 'select Bank'}</option>
                  {banks.map((bank) => (
                    <option key={bank.controlId} value={JSON.stringify(bank)}>
                      {bank.bankName}
                    </option>
                  ))}
                </Form.Select>
                <Form.Control
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={bankAmount}
                  onChange={e => setBankAmount(Number(e.target.value))}
                />
              </>
            )}
            <InputGroup.Checkbox
              checked={bank}
              onChange={(e) => setBank(e.target.checked)}
            />
            <InputGroup.Text>Bank</InputGroup.Text>
          </InputGroup>
        </td>
      </tr>

      {/* Card Payment */}
      <tr>
        <td colSpan={3}>
          <InputGroup className="mb-2">
            {card && (
              <Form.Control
                type="number"
                step="0.01"
                placeholder="0.00"
                value={cardAmount}
                onChange={e => setCardAmount(Number(e.target.value))}
              />
            )}
            <InputGroup.Checkbox
              checked={card}
              onChange={(e) => setCard(e.target.checked)}
            />
            <InputGroup.Text>Card</InputGroup.Text>
          </InputGroup>
        </td>
      </tr>
    </>
  );
}

export default function DataTable(props) {
    
    const {type} = props
    const { state } = useContext(useStore)
    const {userData, supplierData, customerData, companyData, saleData, purchaseData} = state


    const [items, setItems] = useState([])
    const [item, setItem] = useState({
        code: '',
        name: '',
        catgeory:"",
        unit: "",
        description: '',
        qty:0,
        vat: 0,
        salePrice:0,
        purchasePrice:0,
        inStock:0,
      })

    
    ///TABLE CALC STATE FUNCTIONS
    const [discount, setDiscount] = useState(0);
    const [cash, setCash] = useState(false);
    const [bank, setBank] = useState(false);
    const [card, setCard] = useState(false);
    const [selectedBank, setSelectedBank] = useState(null)
    const [paymentMethod, setPaymentMethod] = useState(null)
    const [advance, setAdvance] = useState(false);
    const [cashAmount, setCashAmount] = useState(0);
    const [bankAmount, setBankAmount] = useState(0);
    const [cardAmount, setCardAmount] = useState(0);
    const [vatRate, setVatRate] = useState(0.05)
    const [vatEnabled, setVatEnabled] = useState(true)
    const [bankName, setBankName ] = useState('')
    const [deliveryNoteNumber, setDeliveryNoteNumber ] = useState('')
    const [advanceAmount, setAdvanceAmount] = useState(0);


    ////TABLE SEARCH & SELECT FILTER STATE FUNCTIONS
    const [filterItems, setFilterItems ] = useState([])
    const [searchTerm, setSearchTerm] = useState({});


    //Modal State
    const [newCategory, setNewCategory] = useState(false)
    const [newItem, setNewItem] = useState(false)
    const [categories, setCategories] = useState([])
    const [products, setProducts] = useState([])
    const [banks, setBanks] = useState([])
    const [units, setUnits] = useState([])


    //CREATE ITEM MODAL STATE OBJECT
    const [creatItem, setCreateItem] = useState({
      name:'',
      category:"",
      purchasePrice: '',
      unit:"",
      salePrice: '',
    })
    
    //CREATE ITEM MODAL STATE OBJECT
    const [category, setCategory] = useState('')
    

    ///ACTIVE DROPDOWN STATE
    const [activeRow, setActiveRow] = useState(null)
    

      ////FUNCTION TO ADD NEW ITEM ROW
      const handleAddRow = () => {
        setItems([...items, {...item}]);
      };
    
      ///HELPER FUNCTION TO REMOVE ROW
      const handleRemoveRow = (index) => {
        setItems((prevItems) => prevItems.filter((_, i)=> i !== index));
      };
      


      ///SAVE NEW PRODUCT FROM MODAL
      const saveNewItem = async()=>{
        //console.log(creatItem)
        toast.promise(
          axios.post('/api/items', {
            name: creatItem.name,
            purchasePrice: creatItem.purchasePrice,
            salePrice: creatItem.salePrice,
            category: creatItem.category,
            unit: creatItem.unit
          }),

          {
            pending: "...wait",
            success:"Done",
            error: "Oops, try again!"
          }
        )

        if(data){
          setProducts([...products, {...data}])
        }
      }


      ///SAVE NEW CATEGORY FROM MODAL
      const saveNewCategory = async()=>{
        //console.log(creatItem)
        const {data} = await axios.post('/api/category', {
          name: category
        })

        if(data){
          setCategories([...categories, {...data}])
        }
      }

      ///FETCH INITIAL DATA USE EFFECT
      useEffect(()=>{
        tableData()

        if(bank){
          setPaymentMethod("bank")
        }else if(cash){
          setPaymentMethod("cash")
        }else if(card){
          setPaymentMethod("card")
        }

      }, [cash, card, bank])


      //FETCH CATEGORIES, UNITS, BANKS & PRODUCTS
      const tableData = async()=>{

          const [categoriesRes, productsRes, banksRes, unitsRes] = await Promise.all([
            axios.get('/api/category'),
            axios.get('/api/items'),
            axios.get('/api/banks'),
            axios.get('/api/units')
          ])
  
          setCategories(categoriesRes.data)
          setProducts(productsRes.data)
          setBanks(banksRes.data)
          setUnits(unitsRes.data)
      }


      ///EDIT ROW FUNCTION
      const handleRowChange = (index, field, value) => {
        if (type !== 'purchase' && (field === 'qty' || field === 'salePrice' || 'description')) {
            // Handle non-purchase logic
            setItems((prevItems) =>
                prevItems.map((itm, i) =>
                    i === index ? { ...itm, [field]: value } : itm
                )
            );
    
            // Recalculate total if qty or salePrice changes
            setItems((prevItems) =>
                prevItems.map((itm, i) => {
                    if (i === index) {
                        const unitCost = round2(itm.qty * itm.salePrice); // Unit cost
                        const vat = round2(unitCost * vatRate); // VAT
                        const total = unitCost + vat; // Total value
                        const description = itm.description
    
                        return { 
                            ...itm,
                            description: description,
                            vat: vat,
                            unitCost: unitCost,
                            total: total
                        };
                    }
                    return itm;
                })
            );
        } else if (type === 'purchase' && (field === 'qty' || field === 'purchasePrice' || 'description')) {
            // Handle purchase logic
            setItems((prevItems) =>
                prevItems.map((itm, i) =>
                    i === index ? { ...itm, [field]: value } : itm
                )
            );
    
            // Recalculate total if qty or purchasePrice changes
            setItems((prevItems) =>
                prevItems.map((itm, i) => {
                    if (i === index) {
                        const unitCost = round2(itm.qty * itm.purchasePrice); // Unit cost
                        const vat = round2(unitCost * vatRate); // VAT
                        const total = unitCost + vat; // Total value
                        const description = itm.description
    
                        return { 
                            ...itm,
                            vat: vat,
                            unitCost: unitCost,
                            total: total,
                            description: description
                        };
                    }
                    return itm;
                })
            );
        }
    };
    
    
    

      //SEARCH PRODUCT ON INPUT
      const handleSearchChange = (index, e) => {
        const value = e.target.value;
        setSearchTerm((prevState) => ({ ...prevState, [index]: value }));
    
        setActiveRow(index)
    
        if (value) {
            const filtered = products.filter((itm) => itm.name.toLowerCase().includes(value.toLowerCase()));
            setFilterItems(filtered);
        } else {
            setFilterItems([]);
            setActiveRow(null)
        }
      };
    

      ///SELECT PRODUCT FROM SEARCH
      const handleSelectItem = (index, selectedItem) => {
        setItems((prevItems) =>
            prevItems.map((itm, i) =>
                i === index
                    ? { 
                        ...itm, 
                        code: selectedItem.code || itm.code,
                        name: selectedItem.name, 
                        description: selectedItem.description || '', 
                        purchasePrice: selectedItem.purchasePrice || 0, 
                        salePrice: selectedItem.salePrice || 0, 
                        qty: selectedItem.qty || 1, // Default to 1 when selecting item
                        inStock: selectedItem.inStock || 0,
                        category: selectedItem.category || itm.category,
                        unit: selectedItem.unit || itm.unit,
                    }
                    : itm
            )
        );
    
        // Recalculate unitCost, vat, and total after the item details have been updated
        setItems((prevItems) =>
            prevItems.map((itm, i) => {
                if (i === index) {
                    const unitCost = round2(itm.qty * itm.salePrice); // Unit cost
                    const vat = round2(unitCost * vatRate); // VAT
                    const total = unitCost + vat; // Total value
                    const description = itm.description
    
                    return { 
                        ...itm,
                        unitCost: unitCost,
                        vat: vat,
                        total: total,
                        description: description
                    };
                }
                return itm;
            })
        );
    
        setSearchTerm((prev) => ({ ...prev, [index]: selectedItem.name }));
        setFilterItems([]);
        setActiveRow(null);
    };
    
    
      // Handle category change
      const handleCategoryChange = (index, value) => {
        setItems((prevItems) =>
            prevItems.map((itm, i) =>
                i === index ? { ...itm, category: value } : itm.category
            )
        );
      };


      const handleBankChange = (e) => {
        const selectedBank = JSON.parse(e.target.value);
        setSelectedBank(selectedBank);
        console.log(selectedBank)
      };

      

      //STATE OBJECT VALUES FOR CALCULATOR
      const calculator = createCalc({
        vatEnabled, vatRate, discount, 
        cash, bank, card, cashAmount, 
        bankAmount, cardAmount, 
        advanceAmount, items
      })
      
      const pendingAmount = calculator.pendingAmount().toFixed(2)
      const vatAmount = calculator.vatAmount().toFixed(2)
      const totalWithoutVat = calculator.totalWithoutVat().toFixed(2)
      const totalAfterDiscount = calculator.totalAfterDiscount().toFixed(2)
      const itemsWithVatTotal =calculator.itemsGrossTotal().toFixed(2)
      const discountAmount = calculator.discountAmount().toFixed(2)
      const advanceTotal = calculator.advanceAmount().toFixed(2)
      const paidAmount = calculator.paidAmount().toFixed(2)
      const grandTotal = calculator.grandTotal().toFixed(2)


      const data = {
        vatRate, discount, 
        cashAmount, bankAmount, 
        vatEnabled, bankName,
        cardAmount, advanceAmount, 
        items, pendingAmount, vatAmount,
        totalAfterDiscount, totalWithoutVat,
        itemsWithVatTotal, discountAmount,
        advanceTotal, paidAmount, advanceAmount
      }
      

      ///SWITCH STATEMENT THAT ADJUSTS DATA FORMAT ACCORDING TO TYPE PASSED TO THE TABLE
      const getDataForType = ( type ) => {
        let preparedData = { ...data };


        switch (type) {
          case 'purchase':
            const purchaseOrderNo = localStorage.getItem('purchaseOrderNo')
            const purchaseInvNo = localStorage.getItem('purchaseInvNo')
            preparedData = { 
              ...preparedData, 
              supplier: supplierData,
              employee: userData,
              paymentMethod,
              bankName,
              purchaseOrderNo: JSON.parse(purchaseOrderNo),
              purchaseInvNo: JSON.parse(purchaseInvNo)
            };
            break;
      
          case 'sales':
            const dataNo = localStorage.getItem('deliveryNote') 
            const purchaseNo = localStorage.getItem('purchaseOrder')
            const savedDate = localStorage.getItem('invDate')

            preparedData = { 
              ...preparedData, 
              customer: customerData,
              employee: userData,
              paymentMethod,
              bankName,
              date: JSON.parse(savedDate),
              deliveryNote: JSON.parse(dataNo),
              purchaseOrderNumber: JSON.parse(purchaseNo)
            };
            break;
      
          case 'quotation':
            preparedData = { 
              ...preparedData, 
              customer: customerData,
              employee: userData,
            };
            break;

          case 'return':
            preparedData = { 
              ...preparedData, 
              sale: saleData,
              purchase: purchaseData,
              employee: userData,
            };
            break;

          case 'deliveryNote':
            preparedData = { 
              ...preparedData, 
              customer: customerData,
              employee: userData
            };
            break;
      
          case 'invoice':
            preparedData = { 
              ...preparedData, 
              companyInfo: companyData,
              paymentMethod,
              bankName,
              date: JSON.parse(savedDate)
            };
            break;
      
          default:
            console.error('Unknown type:', type);
            break;
        }
      
        return preparedData;
      };
      
      //PRINT & SAVE HANDLER
      const saveData = async (type, data) => {
        await axios.post(`/api/${type}/save`, { data });
      };
      
      const saveAndPrint = async (type, data) => {
          try {
            const response = await axios.post(`/api/${type}`, { data }, { responseType: "blob" });
            const blob = new Blob([response.data], { type: "application/pdf" });
            const url = window.URL.createObjectURL(blob);
            window.open(url, "_blank");

            
            localStorage.removeItem('invDate')
            localStorage.removeItem('deliveryNote') 
            localStorage.removeItem('purchaseOrder')
            localStorage.removeItem('invDate')
            localStorage.removeItem('purchaseOrderNo')
            localStorage.removeItem('purchaseInvNo')
          } catch (error) {
            console.error("Error rendering PDF", error);
          }
      };
      
      const handleSave = async (action) => {
        const preparedData = getDataForType(type);
      
        if (["SAVE", "SAVE_AND_PRINT"].includes(action)) {
          toast.promise(
            (async () => {
              switch (action) {
                case "SAVE":
                  console.log("Save only");
                  await saveData(type, preparedData);
                  break;
                case "SAVE_AND_PRINT":
                  console.log("Save and print");
                  await saveAndPrint(type, preparedData);
                  break;
              }
            })(),
            {
              pending: "...wait",
              success: "Done",
              error: "Oops, try again!",
            },
            {
              autoClose: 3000,
            }
          );
        } else {
          console.log("Unknown action");
        }
      };



    return (
    <>
    <Table striped bordered hover className='my-3' responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>Category</th>
              <th>Item</th>
              <th>Unit</th>
              <th>Qty</th>
              <th>Pprice</th>
              <th>Sprice</th>
              <th>Cost</th>
              <th>Vat</th>
              <th>Total Incl.Vat</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items?.map((itm, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>
                  {itm.category ? (
                    <Form.Control type='text' value={itm?.category} readOnly/>
                  ):(
                    <Form.Select name='category' 
                    onChange={(e) => handleCategoryChange(index, e.target.value)}>
                    <option>{itm.category || 'select'}</option>
                    {categories?.map((cat, catIndex)=> (
                        <option key={catIndex}>{cat.name}</option>
                    ))}
                  </Form.Select>
                  )}
                </td>
                <td>
                  {/* Editable fields for name and description */}
                  <Stack gap={2}>
                    <Form.Control className='sm'
                      type="text"
                      value={searchTerm[index] || ""}
                      onChange={(e) => handleSearchChange(index, e)}
                      placeholder="Item Name"
                    />
                    {activeRow === index && filterItems?.length > 0 &&(
                      <ListGroup 
                        style={{zIndex: 1, maxHeight: '250px', height:'250px', overflowY:"auto", background:"white"}}>
                        {filterItems?.map((filteredItem)=> (
                          <ListGroup.Item
                          key={filteredItem.code}
                          onClick={() => handleSelectItem(index, filteredItem)}
                          >
                            {filteredItem.name}
                          </ListGroup.Item>
                        ))}
                      </ListGroup>
                    )}
                    <Form.Control as='textarea'
                      type="text"
                      value={itm.description  || ''}
                      onChange={(e) =>
                        handleRowChange(index, 'description', e.target.value)
                      }
                      placeholder="Description"
                      rows={3}
                    />
                  </Stack>
                </td>
                <td>
                  <Form.Control
                    type="text" readOnly
                    value={itm.unit || ''}
                    onChange={(e) =>
                      handleRowChange(index, 'unit', e.target.value)
                    }
                  />
                </td>
                <td>
                  <Form.Control
                    type="number"
                    value={itm.qty || 0}
                    onChange={(e) =>
                      handleRowChange(index, 'qty', Number(e.target.value))
                    }
                  />
                </td>
                <td>
                  <Form.Control
                    type="number"
                    value={itm.purchasePrice || 0}
                    onChange={(e) =>
                      handleRowChange(index, 'purchasePrice', Number(e.target.value))
                    }
                  />
                </td>
                <td>
                  <Form.Control
                    type="number"
                    value={itm.salePrice || 0}
                    onChange={(e) =>
                      handleRowChange(index, 'salePrice', Number(e.target.value))
                    }
                  />
                </td>
                <td>{itm.unitCost}</td>
                <td>{round2(itm.vat)}</td>
                <td>{itm.total}</td>
                <td>
                    <Stack>
                        <Button variant='light' onClick={()=> handleRemoveRow(index)}>❌</Button>
                    </Stack>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
  {/* Summary Section */}
  <tr className="summary-row">
    <th colSpan={3}>Totals Summary:</th>
  </tr>
  
  {/* Amount Breakdown */}
  <tr>
    <td colSpan={3}>
      <div className="amount-row">
        <span className="label">Items Total Incl VAT:</span>
        <span className="value">AED: {itemsWithVatTotal}</span>
      </div>
    </td>
  </tr>
  <tr>
    <td colSpan={3}>
      <div className="amount-row">
        <span className="label">Items Total Excl VAT:</span>
        <span className="value">AED: {totalWithoutVat}</span>
      </div>
    </td>
  </tr>

  {/* Discount Input */}
  <tr>
    <td colSpan={3}>
      <InputGroup className="mb-2">
        <InputGroup.Text>Discount</InputGroup.Text>
        <Form.Control
          type="number"
          step="0.01"
          placeholder="Discount Amount"
          value={discount}
          onChange={e => setDiscount(Number(e.target.value))}
        />
      </InputGroup>
    </td>
  </tr>

  {/* VAT Toggle */}
  <tr>
    <td colSpan={3}>
      <InputGroup className="mb-2">
        {vatEnabled && (
          <Form.Control
            type="number"
            step="0.01"
            value={vatRate}
            onChange={e => setVatRate(Number(e.target.value))}
            placeholder="0.00%"
          />
        )}
        <InputGroup.Checkbox
          checked={vatEnabled}
          onChange={e => setVatEnabled(e.target.checked)}
        />
        <InputGroup.Text>VAT Applied: {vatRate || 0}%</InputGroup.Text>
      </InputGroup>
    </td>
  </tr>

  {/* Calculated Totals */}
  <tr>
    <td colSpan={3}>
      <div className="amount-row">
        <span className="label">Total After Discount:</span>
        <span className="value">AED: {totalAfterDiscount}</span>
      </div>
    </td>
  </tr>
  <tr>
    <td colSpan={3}>
      <div className="amount-row">
        <span className="label">VAT Amount:</span>
        <span className="value">AED: {vatAmount}</span>
      </div>
    </td>
  </tr>
  <tr>
    <td colSpan={3}>
      <div className="amount-row highlight">
        <span className="label">Grand Total:</span>
        <span className="value">AED: {grandTotal}</span>
      </div>
    </td>
  </tr>

  {/* Payment Methods */}
  <PaymentMethodsSection 
    advance={advance}
    advanceAmount={advanceAmount}
    setAdvance={setAdvance}
    setAdvanceAmount={setAdvanceAmount}
    cash={cash}
    cashAmount={cashAmount}
    setCash={setCash}
    setCashAmount={setCashAmount}
    bank={bank}
    bankAmount={bankAmount}
    bankName={bankName}
    banks={banks}
    handleBankChange={handleBankChange}
    setBank={setBank}
    setBankAmount={setBankAmount}
    card={card}
    cardAmount={cardAmount}
    setCard={setCard}
    setCardAmount={setCardAmount}
  />

  {/* Payment Summary */}
  <tr>
    <td colSpan={3}>
      <div className="amount-row">
        <span className="label">Total Paid Amount:</span>
        <span className="value">AED: {calculator.paidAmount().toFixed(2)}</span>
      </div>
    </td>
  </tr>
  <tr>
    <td colSpan={3}>
      <div className="amount-row">
        <span className="label">Total Pending Amount:</span>
        <span className="value">AED: {calculator.pendingAmount().toFixed(2)}</span>
      </div>
    </td>
  </tr>

  {/* Action Buttons */}
  <tr>
    <td colSpan={12}>
      <div className="action-buttons d-flex justify-content-between">
        <ButtonGroup>
          <Button variant="primary" onClick={() => setNewItem(true)}>
            New Item
          </Button>
          <Button variant="secondary" onClick={() => setNewCategory(true)}>
            New Category
          </Button>
          <Button variant="warning" onClick={handleAddRow}>
            Add Row ➕
          </Button>
        </ButtonGroup>

        <ButtonGroup className="main-actions">
          <Button
            variant="secondary"
            disabled={type === 'return'}
            onClick={() => items.length > 0 && window.confirm('Save & Print Now?') && handleSave('SAVE_AND_PRINT')}
          >
            Save & Print
          </Button>
          <Button
            variant="success"
            onClick={() => items.length > 0 && window.confirm('Save Actions?') && handleSave('SAVE')}
          >
            Save 💾
          </Button>
          <Button
            variant="danger"
            onClick={() => items.length > 0 && window.confirm('Undo all Actions?') && setItems([])}
          >
            Cancel
          </Button>
        </ButtonGroup>
      </div>
    </td>
  </tr>
</tfoot>
  </Table>
    


    {/**NEW CATEGORY MODAL */}
    <Modal show={newCategory} onHide={()=> setNewCategory(false)}>
      <Modal.Header closeButton>
        <Modal.Title>New Category</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Control type='text' className='mb-2'
          placeholder='category name'
          value={category}
          onChange={(e)=> setCategory(e.target.value)}/>
      </Modal.Body>
      <Modal.Footer>
          <Button variant="secondary" onClick={()=> setNewCategory(false)}>
            CANCEL
          </Button>
          <Button variant="primary" onClick={()=> saveNewCategory()}>SAVE</Button>
        </Modal.Footer>
    </Modal>

    {/**NEW PRODUCT MODAL */}
    <Modal show={newItem} onHide={()=> setNewItem(false)}>
      <Modal.Header closeButton>
        <Modal.Title>New Item(Product)</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Control className='mb-2'
          placeholder='name'
          value={creatItem.name}
          type='text' onChange={(e)=> {
          setCreateItem((prevState)=> ({...prevState, name: e.target.value}))
        }}/>
        <Form.Control className='mb-2'
          placeholder='purchasePrice'
          value={creatItem.purchasePrice}
          type='text' onChange={(e)=> {
          setCreateItem((prevState)=> ({...prevState, purchasePrice: e.target.value}))
        }}/>
        <Form.Control className='mb-2'
          placeholder='salePrice'
          value={creatItem.salePrice}
          type='text' onChange={(e)=> {
          setCreateItem((prevState)=> ({...prevState, salePrice: e.target.value}))
        }}/>
        <Form.Select className='mb-2' 
          value={creatItem.category || ''}
          onChange={(e)=>{
            setCreateItem((prevState)=> ({...prevState, category: e.target.value}))
          }}
        >
          <option>--category--</option>
          {categories.map((unit)=>(
            <option key={unit.code} value={unit.name}>
              {unit.name}
            </option>
          ))}
        </Form.Select>
        <Form.Select value={creatItem.unit || ''} 
          onChange={(e)=>{
            setCreateItem((prevState)=> ({...prevState, unit: e.target.value}))
          }}
        >
          <option>--Unit--</option>
          {units.map((unit)=>(
            <option key={unit.code} value={unit.name}>
              {unit.name}
            </option>
          ))}
        </Form.Select>
      </Modal.Body>
      <Modal.Footer>
          <Button variant="secondary" onClick={()=> setNewItem(false)}>
            CANCEL
          </Button>
          <Button variant="primary" onClick={()=> saveNewItem()}>SAVE</Button>
        </Modal.Footer>
    </Modal>
    </>
  )
}
