import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Cart.css';

const Cart = () => {
    const [cart, setCart] = useState([]);
    const [products, setProducts] = useState({});
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const { isAuthenticated } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) {
            fetchCart();
        }
    }, [isAuthenticated]);

    const fetchCart = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/users/me/cart', {
                credentials: 'include',
            });
            if (!response.ok) throw new Error('Failed to fetch cart');
            const data = await response.json();
            setCart(data.cart);
            fetchProductDetails(data.cart);
        } catch (err) {
            console.error('Error fetching cart:', err);
            setError('Failed to fetch cart');
        } finally {
            setLoading(false);
        }
    };

    const fetchProductDetails = async (cartItems) => {
        try {
            const productIds = cartItems.map(item => item.productId);
            const productDetails = {};

            await Promise.all(
                productIds.map(async (productId) => {
                    const response = await fetch(`http://localhost:3000/api/products/${productId}`);
                    if (!response.ok) throw new Error(`Failed to fetch product ${productId}`);
                    const data = await response.json();
                    productDetails[productId] = data;
                })
            );

            setProducts(productDetails);
        } catch (err) {
            console.error('Error fetching product details:', err);
            setError('Failed to fetch product details');
        }
    };

    const placeOrder = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/users/me/orders', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to place order');
            }

            // сlear cart after successful order
            await clearCart();
            navigate('/orders');
        } catch (err) {
            console.error('Error placing order:', err);
            setError('Failed to place order');
        }
    };

    const clearCart = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/users/me/cart/clear', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to clear cart');
            }

            setCart([]); // сlear cart in state
            setProducts({}); // сlear products in state
        } catch (err) {
            console.error('Error clearing cart:', err);
            setError('Failed to clear cart');
        }
    };

    const calculateSubtotal = (item) => {
        const product = products[item.productId];
        return product ? product.price * item.quantity : 0;
    };

    const calculateTotal = () => {
        return cart.reduce((total, item) => total + calculateSubtotal(item), 0);
    };

    const handleBackToProducts = () => {
        navigate('/products');
    };

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="cart-container">
            <div className="cart-header">
                <h2>Your Cart</h2>
                <button 
                    className="back-to-products"
                    onClick={handleBackToProducts}
                >
                    Back to Products
                </button>
            </div>
            
            <div className="cart-items">
                {cart.map((item) => {
                    const product = products[item.productId];
                    return (
                        <div key={item._id} className="cart-item">
                            <div className="item-image">
                                <img 
                                    src={product?.imagePath} 
                                    alt={product?.name || 'Product'} 
                                    onError={(e) => {
                                        e.target.src = '/placeholder-image.jpg';
                                    }}
                                />
                            </div>
                            <div className="item-details">
                                <h3>{product?.name || 'Loading product...'}</h3>
                                <p className="item-price">Price: ${product?.price?.toFixed(2) || '0.00'}</p>
                                <p className="item-quantity">Quantity: {item.quantity}</p>
                                <p className="item-subtotal">
                                    Subtotal: ${calculateSubtotal(item).toFixed(2)}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="cart-summary">
                <div className="cart-totals">
                    <div className="subtotals">
                        {cart.map((item) => {
                            const product = products[item.productId];
                            return (
                                <div key={item._id} className="subtotal-item">
                                    <span>{product?.name}: </span>
                                    <span>${calculateSubtotal(item).toFixed(2)}</span>
                                </div>
                            );
                        })}
                    </div>
                    <div className="total-amount">
                        <h3>Total Amount to Pay: ${calculateTotal().toFixed(2)}</h3>
                    </div>
                </div>
                <div className="cart-buttons">
                    <button 
                        className="place-order-btn"
                        disabled={cart.length === 0}
                        onClick={placeOrder}
                    >
                        Place Order (${calculateTotal().toFixed(2)})
                    </button>
                    <button 
                        className="clear-cart-btn"
                        disabled={cart.length === 0}
                        onClick={clearCart}
                    >
                        Clear Cart
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Cart;
