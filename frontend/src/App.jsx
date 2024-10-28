import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Products from './pages/Products';
import Login from './pages/Login';
import Register from './pages/Register';
import Navigation from './pages/Navigation'; // Adjust the import path as necessary
import Cart from './pages/Cart'; // Import the Cart component
import './App.css'; // Import the CSS file

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navigation />
        <Cart /> {/* Include the Cart component here */}
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
