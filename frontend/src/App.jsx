import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Products from './pages/Products';
import Login from './pages/Login';
import Register from './pages/Register';
import Navigation from './pages/Navigation'; 
import Cart from './pages/Cart';
import './App.css';
import ProtectedComponent from './pages/ProtectedComponent'; 

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navigation />
        <ProtectedComponent/>
        <Cart />
        <Routes>
          <Route path="/" element={<Products />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
