import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import './Navigation.css';

const Navigation = () => {
    const { isAuthenticated, logout } = useContext(AuthContext);

    const handleLogout = async () => {
        await logout();
    };

    return (
        <nav className="navbar">
            <ul className="navbar-list">
                <li>
                    <Link to="/products">Products</Link>
                </li>
                {isAuthenticated ? (
                    <>
                        <li>
                            <Link to="/cart">Cart</Link>
                        </li>
                        <li>
                            <Link to="/orders">Orders</Link>
                        </li>
                        <li>
                            <button onClick={handleLogout} className="logout-button">
                                Logout
                            </button>
                        </li>
                    </>
                ) : (
                    <>
                        <li>
                            <Link to="/login">Login</Link>
                        </li>
                        <li>
                            <Link to="/register">Register</Link>
                        </li>
                    </>
                )}
            </ul>
        </nav>
    );
};

export default Navigation;
