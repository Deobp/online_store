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
            const response = await fetch('http://localhost:3000/api/users/me/orders', {
                credentials: 'include',
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch orders: ${response.statusText}`);
            }

            const data = await response.json();
            console.log('Fetched orders:', data);
            setOrders(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('Error fetching orders:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const getImagePath = (imagePath) => {
        if (!imagePath) return '/img/placeholder-image.png';
        if (imagePath.startsWith('/img')) return imagePath;
        const fileName = imagePath.split('/').pop();
        return `/img/products/${fileName}`;
    };

    return (
        <div className="orders-container">
            <h2>Your Orders</h2>
            {loading ? (
                <div className="orders-loading">Loading orders...</div>
            ) : error ? (
                <div className="orders-error">{error}</div>
            ) : orders.length === 0 ? (
                <div className="no-orders">No orders found</div>
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
                                {order.products && order.products.map((item, index) => (
                                    <div key={`${order._id}-${index}`} className="order-item">
                                        {item.productId && (
                                            <>
                                                <div className="order-item-image">
                                                    <img 
                                                        src={getImagePath(item.productId.imagePath)}
                                                        alt={item.productId.name || 'Product image'}
                                                        onError={(e) => {
                                                            e.target.src = '/placeholder-image.png';
                                                        }}
                                                    />
                                                </div>
                                                <div className="order-item-details">
                                                    <h4>{item.productId.name}</h4>
                                                    <p>Quantity: {item.quantity}</p>
                                                    <p>Price: ${item.priceAtPurchase}</p>
                                                </div>
                                            </>
                                        )}
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