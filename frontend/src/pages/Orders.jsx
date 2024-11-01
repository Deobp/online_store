import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import './Orders.css';
import { useNavigate } from 'react-router-dom';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { isAuthenticated } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) {
            fetchOrders();
        }
    }, [isAuthenticated]);

    const fetchOrders = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/orders/me', {
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch orders');
            }

            const data = await response.json();
            setOrders(data);
        } catch (err) {
            console.error('Error fetching orders:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (!isAuthenticated) {
        return <div className="orders-error">Please log in to view your orders</div>;
    }

    if (loading) {
        return <div className="orders-loading">Loading your orders...</div>;
    }

    if (error) {
        return <div className="orders-error">{error}</div>;
    }

    return (
        <div className="orders-container">
            <h2>Your Orders</h2>
            {orders.length === 0 ? (
                <p>No orders found</p>
            ) : (
                <div className="orders-list">
                    {orders.map((order) => (
                        <div key={order._id} className="order-card">
                            <div className="order-header">
                                <h3>Order #{order._id}</h3>
                                <span className={`order-status ${order.status}`}>
                                    {order.status}
                                </span>
                            </div>
                            <div className="order-items">
                                {order.products.map((item) => (
                                    <div key={item.productId._id} className="order-item">
                                        <h4>{item.productId.name}</h4>
                                        <p>Quantity: {item.quantity}</p>
                                        <p>Price: ${item.priceAtPurchase}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="order-footer">
                                <p>Total: ${order.totalPrice}</p>
                                <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Orders; 