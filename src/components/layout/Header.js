import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { NavLink } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';  // Import AuthContext

const Header = () => {
    const { isAuthenticated, logout } = useContext(AuthContext);

    return (
        <Navbar bg="dark" data-bs-theme="dark">
            <Container>
                <Navbar.Brand>E-Commerce</Navbar.Brand>
                <Nav className="me-auto">
                    {!isAuthenticated && (
                        <>
                            <Nav.Link as={NavLink} to="/login">Login</Nav.Link>
                            <Nav.Link as={NavLink} to="/register">Register</Nav.Link>
                        </>
                    )}
                    {isAuthenticated && (
                        <>
                            <Nav.Link as={NavLink} to="/products">All Products</Nav.Link>
                            <Nav.Link as={NavLink} to="/add-product">Add Product</Nav.Link>
                            {/* <Nav.Link as={NavLink} to="/update-product">Update Product</Nav.Link> */}
                            <Nav.Link onClick={logout}>Logout</Nav.Link>
                        </>
                    )}
                </Nav>
            </Container>
        </Navbar>
    );
}

export default Header;
