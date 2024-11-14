import React, { useState } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

const Register = () => {
    const navigate = useNavigate(); // Hook to programmatically navigate

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        mobile: '',
        gender: ''
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validate = () => {
        let newErrors = {};

        // Validation logic
        if (!formData.firstName) {
            newErrors.firstName = 'First name is required';
        } else if (!/^[A-Za-z]+$/.test(formData.firstName)) {
            newErrors.firstName = 'First name is invalid';
        }

        if (!formData.lastName) {
            newErrors.lastName = 'Last name is required';
        } else if (!/^[A-Za-z]+$/.test(formData.lastName)) {
            newErrors.lastName = 'Last name is invalid';
        }

        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        if (!formData.mobile) {
            newErrors.mobile = 'Mobile number is required';
        } else if (!/^\d{10}$/.test(formData.mobile)) {
            newErrors.mobile = 'Mobile number must be 10 digits';
        }

        if (!formData.gender) {
            newErrors.gender = 'Gender is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validate()) {
            setIsSubmitting(true);
            try {
                const response = await fetch('http://localhost:3000/api/register', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });

                const result = await response.json();

                if (result.statusCode === 201) {
                    toast.success(result.message, { position: 'top-right' });
                    setTimeout(() => {
                        navigate('/login');
                    }, 1000);
                } else {
                    toast.error(result.message || "Registration failed!", { position: 'top-right' });
                }
            } catch (error) {
                toast.error("An error occurred. Please try again later.", { position: 'top-right' });
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <Container className='pt-3 pb-3 ps-5 pe-5'>
            <Form onSubmit={handleSubmit} noValidate>
                <Row className="mb-3 align-items-center">
                    <Col md={3}>
                        <Form.Label>First Name</Form.Label>
                    </Col>
                    <Col md={9}>
                        <Form.Control
                            type="text"
                            placeholder="Enter first name"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            isInvalid={!!errors.firstName}
                        />
                        <Form.Control.Feedback type="invalid">{errors.firstName}</Form.Control.Feedback>
                    </Col>
                </Row>

                <Row className="mb-3 align-items-center">
                    <Col md={3}>
                        <Form.Label>Last Name</Form.Label>
                    </Col>
                    <Col md={9}>
                        <Form.Control
                            type="text"
                            placeholder="Enter last name"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            isInvalid={!!errors.lastName}
                        />
                        <Form.Control.Feedback type="invalid">{errors.lastName}</Form.Control.Feedback>
                    </Col>
                </Row>

                <Row className="mb-3 align-items-center">
                    <Col md={3}>
                        <Form.Label>Email</Form.Label>
                    </Col>
                    <Col md={9}>
                        <Form.Control
                            type="email"
                            placeholder="Enter email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            isInvalid={!!errors.email}
                        />
                        <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                    </Col>
                </Row>

                <Row className="mb-3 align-items-center">
                    <Col md={3}>
                        <Form.Label>Password</Form.Label>
                    </Col>
                    <Col md={9}>
                        <Form.Control
                            type="password"
                            placeholder="Enter password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            isInvalid={!!errors.password}
                        />
                        <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
                    </Col>
                </Row>

                <Row className="mb-3 align-items-center">
                    <Col md={3}>
                        <Form.Label>Mobile</Form.Label>
                    </Col>
                    <Col md={9}>
                        <Form.Control
                            type="text"
                            placeholder="Enter mobile number"
                            name="mobile"
                            value={formData.mobile}
                            onChange={handleChange}
                            isInvalid={!!errors.mobile}
                        />
                        <Form.Control.Feedback type="invalid">{errors.mobile}</Form.Control.Feedback>
                    </Col>
                </Row>

                <Row className="mb-3 align-items-center">
                    <Col md={3}>
                        <Form.Label>Gender</Form.Label>
                    </Col>
                    <Col md={9}>
                        <Form.Control
                            as="select"
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            isInvalid={!!errors.gender}
                        >
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </Form.Control>
                        <Form.Control.Feedback type="invalid">{errors.gender}</Form.Control.Feedback>
                    </Col>
                </Row>

                <Button variant="primary" type="submit" className="mt-3" disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting...' : 'Submit'}
                </Button>
            </Form>
            <ToastContainer />
        </Container>
    );
}

export default Register;
