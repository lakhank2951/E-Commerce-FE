import React, { useState, useContext, useEffect } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { AuthContext } from '../../context/AuthContext';

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const { login, logout } = useContext(AuthContext);

    useEffect(() => {
        if (location.pathname === '/login') {
            logout();
        }
    }, [location.pathname]);

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validate = () => {
        let newErrors = {};

        // Validation logic
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

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validate()) {
            setIsSubmitting(true);
            try {
                const response = await fetch('http://localhost:3000/api/login', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });

                const result = await response.json();
                if (result.statusCode === 200) {
                    const token = result.data.token;
                    login(token);
                    localStorage.setItem('token',token);
                    toast.success(result.message, { position: 'top-right' });

                    setTimeout(() => {
                        navigate('/products'); // Navigate to the dashboard
                    }, 1000);
                } else {
                    toast.error(result.message || "Login failed!", { position: 'top-right' });
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

                <Button variant="primary" type="submit" className="mt-3" disabled={isSubmitting}>
                    {isSubmitting ? 'Logging In...' : 'Login'}
                </Button>
            </Form>
            <ToastContainer />
        </Container>
    );
}

export default Login;
