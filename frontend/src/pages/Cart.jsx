import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext'; 
import './Cart.css'; 

const Cart = () => {
    const { token, userId } = useContext(AuthContext); 
    const [cartItems, setCartItems] = useState([]);
    const [isCartVisible, setIsCartVisible] = useState(true); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (isCartVisible) {
            fetchCartItems();
        }
    }, [isCartVisible]); 

    const fetchCartItems = async () => {
        try {
            setLoading(true);
            const response = await fetch(`http://localhost:3000/api/users/${userId}/cart`, {
                headers: {
                    'Authorization': `Bearer ${token}` 
                }
            });
            if (!response.ok) {
                throw new Error('Failed to fetch cart items');
            }
            const data = await response.json();
            setCartItems(data);
            setLoading(false);
        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
    };

    const toggleCartVisibility = () => {
        setIsCartVisible(!isCartVisible);
    };

    const handleClearCart = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/users/${userId}/cart/clear`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to clear cart');
            }

            setCartItems([]);
            alert('Cart cleared successfully!');
        } catch (error) {
            console.error(error);
            alert('Failed to clear cart');
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="cart">
            <button onClick={toggleCartVisibility}>
                {isCartVisible ? 'Hide Cart' : 'Show Cart'}
            </button>
            {isCartVisible && (
                <div className="cart-details">
                    <h2>Your Cart</h2>
                    {cartItems.length > 0 ? (
                        <ul>
                            {cartItems.map((item) => (
                                <li key={item._id}>
                                    <img src={item.imagePath} alt={item.name} className="cart-item-image" />
                                    <div>
                                        <h3>{item.name}</h3>
                                        <p>Price: ${item.price}</p>
                                        <p>Quantity: {item.quantity}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>Your cart is empty.</p>
                    )}
                    {cartItems.length > 0 && (
                        <button onClick={handleClearCart}>Clear Cart</button>
                    )}
                </div>
            )}
        </div>
    );
};

export default Cart;