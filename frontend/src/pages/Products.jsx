import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext'; // Import AuthContext
import './Products.css';

const Products = () => {
    const { token, userId } = useContext(AuthContext); // Access the token and userId from context
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);

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

    // Function to add product to cart
    const handleAddToCart = async (product) => {
        try {
            const response = await fetch(`http://localhost:3000/api/users/me/cart`, {
                method: 'POST',
                 credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'//,
                    //'Authorization': `Bearer ${token}` // Include token for authentication
                },
                body: JSON.stringify({ productId: product._id, quantity: 1 }) // Send product ID to backend
            });

            if (!response.ok) {
                throw new Error('Failed to add product to cart');
            }

            const result = await response.json();
            console.log(`Added ${product.name} to cart:`, result);
        } catch (error) {
            console.error(error);
        }
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
                <h1>Products</h1>
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
