import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Products = () => {
    const navigate = useNavigate();

    const [productList, setProductList] = useState([]);
    
    const getAllProducts =  async () => {
        try {
            const response = await fetch('http://localhost:3000/api/products', {
                method: 'GET', 
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const result = await response.json();

            if (result.statusCode === 200) {
                setProductList(result.data)
            } 
        } catch(err) {
            toast.error('An error occurred. Please try again later.', { position: 'top-right' });
        }
    }

    useEffect(() => {
        getAllProducts();
    }, []);

    const handleUpdate = (productId) => {
        navigate(`/update-product/${productId}`)
    }

    const handleDelete = async (productId) => {
        try {
            const response = await fetch(`http://localhost:3000/api/product/${productId}`, {
                method: 'DELETE',
                headers: {
                     'Accept': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const result = await response.json();

            if (result.statusCode === 200) {
                const filteredProducts = productList.filter(product => product._id !== productId)
                setProductList(filteredProducts);
                toast.success(result.message, { position: 'top-right' });
            } 

        } catch(err) {
            toast.error('An error occurred. Please try again later.', { position: 'top-right' });
        }
    }

    return (
        <Container className="mt-5">
        <Row>
            {productList && productList.map((product) => (
                <Col key={product._id} sm={12} md={6} lg={4} className="mb-4">
                    <Card className="product-card">
                        <Card.Img 
                            variant="top" 
                            src={`http://localhost:3000/${product.file}`} 
                            alt={product.name} 
                            style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
                        />
                        <Card.Body>
                            <Card.Title>{product.name}</Card.Title>
                            <Card.Text>{product.description}</Card.Text>
                            <Card.Text>
                                <strong>Price:</strong> ${product.price}
                            </Card.Text>
                        </Card.Body>

                        {/* Hover buttons */}
                        <div className="button-group">
                            <Button variant="warning" onClick={() => handleUpdate(product._id)}>Update</Button>
                            <Button variant="danger" onClick={() => handleDelete(product._id)}>Delete</Button>
                        </div>
                    </Card>
                </Col>
            ))}
        </Row>

        {/* Toast Notifications */}
        <ToastContainer />
    </Container>
    );
};

export default Products;
