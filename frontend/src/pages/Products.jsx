import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Products.css';

const Products = () => {
    const { isAuthenticated } = useContext(AuthContext);
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [addToCartStatus, setAddToCartStatus] = useState('');

    useEffect(() => {
        fetchCategories();
        fetchAllProducts();
    }, []);

    const fetchAllProducts = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:3000/api/products/actual');
            if (!response.ok) {
                throw new Error('Failed to fetch products');
            }
            const data = await response.json();
            setProducts(Array.isArray(data) ? data : []);
            setLoading(false);
        } catch (error) {
            setError(error.message);
            setProducts([]);
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/categories');
            if (!response.ok) {
                throw new Error('Failed to fetch categories');
            }
            const data = await response.json();
            setCategories(data);
        } catch (error) {
            setError(error.message);
        }
    };

    const handleCategoryClick = (categoryId) => {
        setSelectedCategory(categoryId);
    };

    const handleAddToCart = async (product) => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        try {
            const response = await fetch(`http://localhost:3000/api/users/me/cart`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ productId: product._id, quantity: 1 })
            });

            if (!response.ok) {
                throw new Error('Failed to add product to cart');
            }

            const result = await response.json();
            console.log(`Added ${product.name} to cart:`, result);
            
            setAddToCartStatus(`${product.name} added to cart successfully!`);
            setTimeout(() => setAddToCartStatus(''), 3000);
        } catch (error) {
            console.error('Error adding to cart:', error);
            setAddToCartStatus(`Error: ${error.message}`);
            setTimeout(() => setAddToCartStatus(''), 3000);
        }
    };


    const handleViewCart = () => {
        navigate('/cart');
    };

    const filteredProducts = selectedCategory
        ? products.filter(product => product.categoryId === selectedCategory)
        : products;

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="products-page">
            {addToCartStatus && (
                <div className="add-to-cart-status">
                    {addToCartStatus}
                </div>
            )}
            <div className="products-header">
                <h1>Products</h1>
                {isAuthenticated && (
                    <button 
                        className="view-cart-button"
                        onClick={handleViewCart}
                    >
                        View Cart
                    </button>
                )}
            </div>
            <div className="categories-container">
                <h2>Categories</h2>
                <ul className="categories-list">
                    <li 
                        className={`category-item ${selectedCategory === null ? 'selected' : ''}`} 
                        onClick={() => handleCategoryClick(null)}
                    >
                        All Products
                    </li>
                    {categories.map((category) => (
                        <li 
                            key={category._id} 
                            className={`category-item ${selectedCategory === category._id ? 'selected' : ''}`}
                            onClick={() => handleCategoryClick(category._id)}
                        >
                            {category.name}
                        </li>
                    ))}
                </ul>
            </div>
            <div className="products-container">
                <div className="products-grid">
                    {filteredProducts.length > 0 ? (
                        filteredProducts.map((product) => (
                            <div key={product._id} className="product-card">
                                <img src={product.imagePath} alt={product.name} className="product-image" />
                                <h3>{product.name}</h3>
                                <p>{product.description}</p>
                                <p>Price: ${product.price}</p>
                                <button onClick={() => handleAddToCart(product)}>Add to Cart</button>
                            </div>
                        ))
                    ) : (
                        <p>No products available</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Products;
