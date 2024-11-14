import React, { useState, useRef, useEffect } from 'react';
import { Form, Button, Container, Row, Col, Card } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

const AddProduct = () => {
    const { productId } = useParams();
    const [fileName, setFileName] = useState(null)
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        price: '',
        description: '',
        file: null,
    });

    const fileInputRef = useRef(null);

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validateForm = () => {
        const newErrors = {};
        const nameRegex = /^[a-zA-Z\s]+$/;
        const priceRegex = /^\d+(\.\d{1,2})?$/;

        if (!nameRegex.test(formData.name)) {
            newErrors.name = 'Name should contain only alphabets';
        }

        if (!priceRegex.test(formData.price)) {
            newErrors.price = 'Price should be a decimal value';
        }

        if (!nameRegex.test(formData.description)) {
            newErrors.description = 'Description should contain only alphabets';
        }

        if(!productId) {
            if (!formData.file) {
                newErrors.file = 'File is required';
            } else {
                const fileExtension = formData.file.name.split('.').pop().toLowerCase();
                if (!['jpeg', 'png'].includes(fileExtension)) {
                    newErrors.file = 'File should be in jpeg or png format';
                }
            }
        } else {
            if(formData.file) {
                const fileExtension = formData.file.name.split('.').pop().toLowerCase();
                if (!['jpeg', 'png'].includes(fileExtension)) {
                    newErrors.file = 'File should be in jpeg or png format';
                }
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData({
            ...formData,
            [name]: files ? files[0] : value,
        });
    };

    useEffect(() => {
        if (productId) {
            getProductDetails();
        } else {
            setFormData({ name: '', price: '', description: '', file: null });
            setFileName(null)
        }
    }, [productId])

    const getProductDetails = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/product/${productId}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    "Authorization": `Bearer ${localStorage.getItem('token')}`
                }
            })

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const result = await response.json();

            if (result.statusCode === 200) {
                const { name, price, description, file } = result.data;
                setFormData({ name, price, description, file: null });
                setFileName(file)
            }

        } catch (error) {
            console.error('Error:', error);
            toast.error('An error occurred. Please try again later.', { position: 'top-right' });
        }
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            if (productId) {
                setIsSubmitting(true);
                updateExistingProduct()
            } else {
                setIsSubmitting(true);
                addNewProduct()
            }
        }
    };

    const addNewProduct = async () => {
        try {
            let data = new FormData();
            data.append('name', formData.name);
            data.append('price', formData.price);
            data.append('description', formData.description);
            data.append('file', formData.file);

            const response = await fetch('http://localhost:3000/api/addProduct', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: data
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const result = await response.json();

            if (result.statusCode === 201) {
                toast.success('Product added successfully!', { position: 'top-right' });

                fileInputRef.current.value = '';
                // Reset form after successful submission
                setTimeout(() => {
                    setFormData({ name: '', price: '', description: '', file: null });
                    setIsSubmitting(false);
                }, 1000);
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('An error occurred. Please try again later.', { position: 'top-right' });
            setIsSubmitting(false);
        }
    }

    const updateExistingProduct = async () => {
        try {
            const data = new FormData();
            data.append('name', formData.name);
            data.append('price', formData.price);
            data.append('description', formData.description);

            if(formData.file) {
                data.append('file', formData.file);
            }

            const response = await fetch(`http://localhost:3000/api/product/${productId}`, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: data
            })

            if(!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`)
            }

            const result = await response.json();

            if(result.statusCode === 200) {
                toast.success('Product updated successfully!', { position: 'top-right' });

                // Reset form after successful submission
                fileInputRef.current.value = '';
                setFormData({ name: '', price: '', description: '', file: null });
                setFileName(null);
                setIsSubmitting(false);

                setTimeout(() => {                   
                    navigate('/products')
                }, 1000);
            } 
        } catch (error) {
            console.error('Error:', error);
            toast.error('An error occurred. Please try again later.', { position: 'top-right' });
            setIsSubmitting(false);
        }
    }

    return (
        <Container className="pt-3 pb-3 ps-5 pe-5">
            <Form onSubmit={handleSubmit} noValidate>
                <h3>Add Product</h3>

                {/* Name Field */}
                <Row className="mb-3 align-items-center">
                    <Col md={3}>
                        <Form.Label>Name</Form.Label>
                    </Col>
                    <Col md={9}>
                        <Form.Control
                            type="text"
                            placeholder="Enter product name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            isInvalid={!!errors.name}
                        />
                        <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
                    </Col>
                </Row>

                {/* Price Field */}
                <Row className="mb-3 align-items-center">
                    <Col md={3}>
                        <Form.Label>Price</Form.Label>
                    </Col>
                    <Col md={9}>
                        <Form.Control
                            type="text"
                            placeholder="Enter product price"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            isInvalid={!!errors.price}
                        />
                        <Form.Control.Feedback type="invalid">{errors.price}</Form.Control.Feedback>
                    </Col>
                </Row>

                {/* Description Field */}
                <Row className="mb-3 align-items-center">
                    <Col md={3}>
                        <Form.Label>Description</Form.Label>
                    </Col>
                    <Col md={9}>
                        <Form.Control
                            type="text"
                            placeholder="Enter product description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            isInvalid={!!errors.description}
                        />
                        <Form.Control.Feedback type="invalid">{errors.description}</Form.Control.Feedback>
                    </Col>
                </Row>

                {/* File Upload Field */}
                <Row className="mb-3 align-items-center">
                    <Col md={3}>
                        <Form.Label>Upload Image</Form.Label>
                    </Col>
                    <Col md={9}>
                        <Form.Control
                            type="file"
                            name="file"
                            onChange={handleChange}
                            isInvalid={!!errors.file}
                            accept=".jpeg,.png"
                            ref={fileInputRef}
                        />
                        <Form.Control.Feedback type="invalid">{errors.file}</Form.Control.Feedback>


                        {
                            fileName ?
                                <Card.Img
                                    className='mt-2'
                                    variant="top"
                                    src={`http://localhost:3000/${fileName}`}
                                    alt={formData.name}
                                    style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
                                /> : ''
                        }

                    </Col>
                </Row>

                {/* Submit Button */}

                {
                    productId ?
                        <Button variant="primary" type="submit" className="mt-3" disabled={isSubmitting}>
                            {isSubmitting ? 'Updating Product...' : 'Update Product'}
                        </Button>
                        : <Button variant="primary" type="submit" className="mt-3" disabled={isSubmitting}>
                            {isSubmitting ? 'Adding Product...' : 'Add Product'}
                        </Button>

                }

            </Form>

            {/* Toast Notifications */}
            <ToastContainer />
        </Container>
    );
};

export default AddProduct;
