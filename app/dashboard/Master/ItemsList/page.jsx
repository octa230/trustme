"use client";

import XlsExportButton from "@/app/components/XlsExportButon";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Container,
  ButtonToolbar,
  Col,
  Row,
  Form,
  ButtonGroup,
  Table,
  Button,
  Modal,
  InputGroup,
  Stack,
  ListGroup,
  Spinner,
} from "react-bootstrap";
import {
  LuGlobe,
  LuImage,
  LuInfo,
  LuLoaderCircle,
  LuPenTool,
  LuPlus,
  LuPrinter,
  LuSearch,
  LuTrash2,
  LuUndo2,
} from "react-icons/lu";
import {
  MdCheckCircleOutline,
  MdOutlineClose,
  MdPhotoLibrary,
} from "react-icons/md";
import { toast } from "react-toastify";

const ItemsList = () => {
  const [products, setProducts] = useState([]);
  const [loadingImg, setLoadingImg] = useState(false);
  const [categories, setCategories] = useState([]);
  const [units, setUnits] = useState([]);
  const [show, setShow] = useState(false);
  const [showFilesModal, setShowFilesModal] = useState(false);
  const [ItemId, setItemId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [openStockModal, setOpenStockModal] = useState(false);
  const [newStock, setNewStock] = useState(0);
  const [selectedItem, setSelectedItem] = useState({
    name: "",
    category: "",
    purchasePrice: "",
    unit: "",
    images: [""],
    salePrice: "",
  });

  const [creatItem, setCreateItem] = useState({
    name: "",
    images: [""],
    category: "",
    purchasePrice: "",
    unit: "",
    salePrice: "",
  });

  const handleCreateItem = (e) => {
    e.preventDefault();

    // Update existing item
    if (selectedItem && selectedItem._id) {
      toast.promise(
        axios.put(`/api/items/${selectedItem._id}`, creatItem).then((res) => {
          setProducts((prevProducts) =>
            prevProducts.map((item) =>
              item._id === res.data._id ? res.data : item
            )
          );
          setCreateItem({
            name: "",
            category: "",
            purchasePrice: "",
            unit: "",
            salePrice: "",
          });
          setShow(false);
        }),
        {
          pending: "...Loading",
          success: "Done",
          error: "Oops! Try Again",
        }
      );
    } else {
      // Create new item
      toast.promise(
        axios.post("/api/items", creatItem).then((res) => {
          setProducts([...products, res.data]);
          setCreateItem({
            name: "",
            category: "",
            purchasePrice: "",
            unit: "",
            salePrice: "",
          });
          setShow(false);
        }),
        {
          pending: "..Wait",
          success: "Done",
          error: "Oops! Try Again",
        }
      );
    }
  };

  const handleDeleteItem = (Item) => {
    if (window.confirm("Delete Item?")) {
      toast.promise(
        axios.delete(`/api/items/${Item._id}`).then((res) => {
          setProducts((prevProducts) =>
            prevProducts.filter((item) => item._id !== Item._id)
          );
        }),
        {
          pending: "..waiting",
          success: "Done!",
          error: "Oops! Try Again",
        }
      );
    }
  };

  const handleEditItem = async (item) => {
    setSelectedItem(item);
    setCreateItem({ ...item });
    setShow(true);
  };

  const handleAddStock = async (e) => {
    e.preventDefault();
    try {
      await toast.promise(
        axios.patch(`/api/stock/patch/${ItemId}`, { newStock }).then((res) => {
          setProducts((prevProducts) =>
            prevProducts.map((item) =>
              item._id === res.data._id ? res.data : item
            )
          );
        }),
        {
          pending: "...Wait",
          success: "Done",
          error: "Something went wrong",
        }
      );
    } catch (error) {
      console.log(error);
    } finally {
      setOpenStockModal(false);
    }
  };

  const handleImages = async (e) => {
    const formData = new FormData();
    const files = e.target.files;

    // Append all files to FormData
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }

    setLoadingImg(true);
    try {
      // Upload the files to the server
      const { data } = await axios.post("/api/uploads", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Update the selected item state with the uploaded images
      setSelectedItem((prev) => ({ ...prev, images: data.data }));

      // Now update the product on the server with the new images
      const product = await axios.put(`/api/items/${selectedItem._id}`, {
        ...selectedItem,
        image: data.data[0],
        images: data.data,
      });

      // Update the products list
      const updatedProductList = products.map((productItem) =>
        productItem._id === product.data._id ? product.data : productItem
      );

      setProducts(updatedProductList);
    } catch (error) {
      console.error("Error during image upload or product update:", error);
    } finally {
      setLoadingImg(false);
    }
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getItems = async () => {
    const [itemsRes, categoryRes, unitsRes] = await Promise.all([
      axios.get("/api/items"),
      axios.get("/api/category"),
      axios.get("/api/units"),
    ]);
    setProducts(itemsRes.data);
    setCategories(categoryRes.data);
    setUnits(unitsRes.data);
  };

  const handleWebItem = async (product) => {
    if (window.confirm("change item webstore visibility?")) {
      try {
        const status = !product?.web;
        const { data } = await axios.put(`/api/items/${product._id}`, { web: status });
        if (data) {
          setProducts((prev) =>
            prev.map((item) => (item._id === data._id ? { ...item, ...data } : item))
          );
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  useEffect(() => {
    getItems();
  }, []);

  return (
    <div>
      <Container fluid>
        <h1>Items List</h1>
        <Row className="d-flex space-between py-3 border">
          <div className="col-md-2">
            <Form.Group>
              <Form.Select>
                <option>--entries--</option>
                {[100, 150, 200, 250].map((x, index) => (
                  <option key={index}>{x}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </div>
          <div className="col-md-6">
            <InputGroup>
              <Form.Control
                type="text"
                placeholder="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-describedby="addon1"
              />
              <Button
                onClick={() => setSearchTerm("")}
                variant="outline-secondary"
              >
                <MdOutlineClose />
              </Button>
            </InputGroup>
          </div>
          <div className="col-xs-12 col-md-3">
            <ButtonGroup>
              <Button size="md" variant="danger" onClick={() => setShow(true)}>
                <LuPlus />
              </Button>
              <Button size="md" variant="danger">
                <LuUndo2 />
              </Button>
              <XlsExportButton data={products} />
              <Button size="md">
                <LuPrinter />
              </Button>
            </ButtonGroup>
          </div>
        </Row>

        <Table hover className="mt-2" bordered align="center" justify="center">
          <thead>
            <tr>
              <th>#</th>
              <th>Category</th>
              <th>Name</th>
              <th>Units</th>
              <th>inStock</th>
              <th>Price</th>
              <th>Sale Price</th>
              <th>Barcode</th>
              <th>Brand</th>
              <th>Model</th>
              <th>Note</th>
              <th>Files</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts?.map((product, index) => (
              <tr key={product.code}>
                <td>{index + 1}</td>
                <td>{product.category}</td>
                <td>{product.name}</td>
                <td>{product.unit}</td>
                <td>{product.inStock}</td>
                <td>{product.purchasePrice}</td>
                <td>{product.salePrice}</td>
                <td>{product.barcode || <LuInfo />}</td>
                <td>{product.brand || <LuInfo />}</td>
                <td>{product.model || <LuInfo />}</td>
                <td>{product.note || <LuInfo />}</td>
                <td
                  onClick={() => {
                    setSelectedItem(product);
                    setShowFilesModal(true);
                  }}
                >
                  <LuImage color={product.images.length ? "green" : "tomato"} />
                </td>
                <td className="d-flex justify-content-center gap-4">
                  <LuPenTool
                    className="btn-sm"
                    onClick={() => handleEditItem(product)}
                  />

                  <LuTrash2
                    className="btn-sm"
                    color="tomato"
                    onClick={() => handleDeleteItem(product)}
                  />
                  <LuPlus
                    className="btn-sm"
                    onClick={() => {
                      setItemId(product._id);
                      setOpenStockModal(true);
                    }}
                  />
                  <LuGlobe 
                    onClick={()=> handleWebItem(product)}
                    color={product.web == true ? 'green': 'gray'}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>
      <Modal
        show={show}
        onHide={() => {
          setShow(false);
        }}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Add New Item</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleCreateItem}>
            <Form.Group className="mb-3">
              <Form.Label>Item Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Item Name"
                value={creatItem.name}
                onChange={(e) =>
                  setCreateItem({ ...creatItem, name: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Control
                type="text"
                placeholder="Category"
                disabled
                value={creatItem.category}
                onChange={(e) =>
                  setCreateItem({ ...creatItem, category: e.target.value })
                }
              />
            </Form.Group>
            <Form.Select
              className="mb-3"
              value={creatItem.category}
              onChange={(e) =>
                setCreateItem({ ...creatItem, category: e.target.value })
              }
            >
              <option>--Select Category--</option>
              {categories.map((category, index) => (
                <option key={index} value={category.name}>
                  {category.name}
                </option>
              ))}
            </Form.Select>
            <Row>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Purchase Price</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Purchase Price"
                    value={creatItem.purchasePrice}
                    onChange={(e) =>
                      setCreateItem({
                        ...creatItem,
                        purchasePrice: e.target.value,
                      })
                    }
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Unit</Form.Label>
                  <Form.Control
                    type="text"
                    disabled
                    placeholder="Unit"
                    value={creatItem.unit}
                    onChange={(e) =>
                      setCreateItem({ ...creatItem, unit: e.target.value })
                    }
                  />
                </Form.Group>
                <Form.Select
                  className="mb-3"
                  value={creatItem.unit}
                  onChange={(e) =>
                    setCreateItem({ ...creatItem, unit: e.target.value })
                  }
                >
                  <option>--Select Unit--</option>
                  {units.map((unit, index) => (
                    <option key={index} value={unit.name}>
                      {unit.name}
                    </option>
                  ))}
                </Form.Select>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Sale Price</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Sale Price"
                    value={creatItem.salePrice}
                    onChange={(e) =>
                      setCreateItem({ ...creatItem, salePrice: e.target.value })
                    }
                  />
                </Form.Group>
              </Col>
            </Row>
            <Button variant="secondary" onClick={() => setShow(false)}>
              Close
            </Button>
            <Button variant="primary" type="submit" className="mx-3">
              Save Item
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/**STOCK MODAL */}
      <Modal show={openStockModal} onHide={() => setOpenStockModal(false)}>
        <Modal.Header closeButton>Add Stock</Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddStock}>
            <Form.Control
              type="number"
              value={newStock}
              placeholder="add stock number"
              onChange={(e) => setNewStock(e.target.value)}
            />
            <ButtonGroup className="my-1">
              <Button type="submit" variant="success">
                Save
              </Button>
              <Button
                variant="danger"
                onClick={() => {
                  setOpenStockModal(false);
                  setNewStock(0);
                }}
              >
                cancel
              </Button>
            </ButtonGroup>
          </Form>
        </Modal.Body>
      </Modal>

      {/**UPLOAD PHOTOS MODAL */}
      <Modal show={showFilesModal} onHide={() => setShowFilesModal(false)}>
        <Modal.Header>
          <Modal.Title>Photos</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Text className="p-2">
                Select on or more files(*jpg, *jpeg, *png)
              </Form.Text>
              <Form.Control type="file" multiple onChange={handleImages} />
            </Form.Group>
          </Form>
          {loadingImg ? (
            <Spinner animation="border" role="status"/>
          ) : (
            <ListGroup>
              {selectedItem.images.length && selectedItem.images?.map((img, i) => (
                <img src={img} key={i} className="img img-thumbnail rounded" height={50} width={50}/>
              ))}
            </ListGroup>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ItemsList;
