import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Products from './pages/Products';
import Login from './pages/Login';

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<Products />} />
                    <Route path="/login" element={<Login />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
