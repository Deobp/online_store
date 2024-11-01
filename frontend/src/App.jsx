import { Routes, Route, Navigate } from 'react-router-dom';
import Navigation from './pages/Navigation';
import Cart from './pages/Cart';
import Products from './pages/Products';
import Orders from './pages/Orders';
import Login from './pages/Login';
import Register from './pages/Register';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';

function App() {
    const { isAuthenticated } = useContext(AuthContext);

    return (
        <div className="app">
            <Navigation />
            <div className="main-content">
                <Routes>
                    <Route path="/" element={<Navigate to="/products" replace />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    
                    <Route 
                        path="/cart" 
                        element={isAuthenticated ? <Cart /> : <Navigate to="/login" />} 
                    />
                    <Route 
                        path="/orders" 
                        element={isAuthenticated ? <Orders /> : <Navigate to="/login" />} 
                    />
                </Routes>
            </div>
        </div>
    );
}

export default App;
