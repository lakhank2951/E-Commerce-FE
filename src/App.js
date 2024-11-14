import './App.css';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Header from './components/layout/Header';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import AddProduct from './components/product/AddProduct';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Products from './components/product/Products';

const App = () => {
  return (
    <div className="App">
      <AuthProvider>
        <BrowserRouter>
          <Header />
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/products" element={<ProtectedRoute element={<Products />} />} />
            <Route path="/add-product" element={<ProtectedRoute element={<AddProduct />} />} />
            <Route path="/update-product/:productId" element={<ProtectedRoute element={<AddProduct />} />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

export default App;
