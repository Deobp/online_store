import { BrowserRouter as Router, Routes, Route, Link} from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Products from './pages/Products';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  return (
      <AuthProvider>
          <Router>
              <nav>
                  <ul>
                      <li>
                          <Link to="/">Products</Link>
                      </li>
                      <li>
                          <Link to="/login">Login</Link>
                      </li>
                      <li>
                          <Link to="/register">Register</Link>
                      </li>
                  </ul>
              </nav>
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
