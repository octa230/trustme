import React, { use, useState } from 'react'
import { Table, Row, Container, Stack, Button, Form } from 'react-bootstrap'
import { v4 as uuidv4 } from 'uuid'

export default function DataTable(props) {
    const {type} = props

    const [items, setItems] = useState([])
    const [item, setItem] = useState({ name: '', description: ''})
    const [Pprice, setPprice] = useState(0)
    const [SPrice, setSprice] = useState(0)
    const [qty, setQty] = useState(0)
    const [inStock, setInstock] = useState(0)
    const [total, setTotal] = useState(0)
    const [vat, setVat] = useState(0.05)
    const [netAmt, setNetAmt] = useState(0)
    const [vatIncl, setVatIncl] = useState(true)
    

    const categories = ['cat', 'dogs', 'birds', 'bees' ]

    const handleAddRow = () => {
        const newItem = { 
          id: uuidv4(), 
          name: item.name, 
          description: item.description,
          purchasePrice: Pprice,
          sellingPrice: SPrice,
          quantity: qty,
          inStock,
          total,
          vat,
          netAmount: netAmt,
          vatIncluded: vatIncl
        };
    
        setItems([...items, newItem]);
    
        // Optionally, reset your inputs for a new row.
        setItem({ name: '', description: '' });
        setPprice(0);
        setSprice(0);
        setQty(0);
        setInstock(0);
        setTotal(0);
        setVat(0.05);
        setNetAmt(0);
        setVatIncl(true);
      };
    
      // A helper to update a specific field of a specific row
      const handleRowChange = (id, field, value) => {
        setItems(
          items.map((itm) =>
            itm.id === id ? { ...itm, [field]: value } : itm
          )
        );
      };

      
  return (

        <Table striped bordered hover className='my-3' responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>Category</th>
              <th>Item</th>
              <th>pPrice</th>
              <th>sPrice</th>
              <th>Qty</th>
              <th>Stock</th>
              <th>Total</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((itm, index) => (
              <tr key={itm.id}>
                <td>{index + 1}</td>
                <td>
                  <select name='category'>
                    <option>---select---</option>
                    {categories.map((cat, index)=> (
                        <option key={index}>{cat}</option>
                    ))}
                  </select>
                </td>
                <td>
                  {/* Editable fields for name and description */}
                  <Stack gap={2}>
                    <input
                      type="text"
                      value={itm.name}
                      onChange={(e) =>
                        handleRowChange(itm.id, 'name', e.target.value)
                      }
                      placeholder="Item Name"
                    />
                    <input
                      type="text"
                      value={itm.description}
                      onChange={(e) =>
                        handleRowChange(itm.id, 'description', e.target.value)
                      }
                      placeholder="Description"
                    />
                  </Stack>
                </td>
                <td>
                  <input
                    type="number"
                    value={itm.purchasePrice}
                    onChange={(e) =>
                      handleRowChange(itm.id, 'purchasePrice', Number(e.target.value))
                    }
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={itm.sellingPrice}
                    onChange={(e) =>
                      handleRowChange(itm.id, 'sellingPrice', Number(e.target.value))
                    }
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={itm.quantity}
                    onChange={(e) =>
                      handleRowChange(itm.id, 'quantity', Number(e.target.value))
                    }
                  />
                </td>
                <td>{itm.inStock}</td>
                <td>{itm.total}</td>
                <td>
                    <Stack>
                        <Button variant='light'>❌</Button>
                    </Stack>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
                <td colSpan='6'>
                </td>
                <td colSpan='3'>
                    <Table width='100%' border='1'>
                        <thead>
                            <tr>
                                <th>Totals Summary</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                            <td><strong>Excl.Vat:</strong> 100.00</td>
                            </tr>
                            <tr>
                                <td><strong>Vat:</strong> {vat * 100}%</td>
                                <Form.Check label='Without Vat'
                                />
                            </tr>
                            <tr>
                            <td><strong>Incl.Vat:</strong> 100.00</td>
                            </tr>
                        </tbody>
                    </Table>
                </td>
            </tr>
            <tr>
                <td colSpan='2'>
                  <Button>New Item</Button>
                  <Button className='mx-2'>New Category</Button>
                </td>
                <td colSpan='6'>
                <Button variant='secondary'>Save & Print</Button>
                <Button variant='success' className='mx-2'>Save 💾</Button>
                <Button variant='danger'>Cancel</Button>
                </td>
                <td colSpan="4">
                <Button onClick={handleAddRow} variant='warning'>Add Row➕</Button>
              </td>
            </tr>
        </tfoot>
    </Table>
  )
}
