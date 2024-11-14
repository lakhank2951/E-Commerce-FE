import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ element }) => {
    const { isAuthenticated, loading } = useContext(AuthContext);

    if (loading || isAuthenticated === null) {
        return <div>Loading...</div>; // Show a spinner or loading message
    }

    return isAuthenticated ? element : <Navigate to="/login" />;
};

export default ProtectedRoute;
