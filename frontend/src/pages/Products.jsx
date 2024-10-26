import React, { useEffect, useState } from 'react';
import './Products.css'; // Import the CSS file

const Products = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/products');
                if (!response.ok) {
                    throw new Error('Failed to fetch products');
                }
                const data = await response.json();
                setProducts(data);
                setLoading(false);
            } catch (error) {
                setError(error.message);
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

        fetchProducts();
        fetchCategories();
    }, []);

    const handleAddToCart = (product) => {
        console.log(`Added ${product.name} to cart`);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="products-page">
            <div className="products-container">
                <h1>Products</h1>
                <div className="products-grid">
                    {products.map((product) => (
                        <div key={product._id} className="product-card">
                            <img src={product.imagePath} alt={product.name} className="product-image" />
                            <h3>{product.name}</h3>
                            <p>{product.description}</p>
                            <p>Price: ${product.price}</p>
                            <button onClick={() => handleAddToCart(product)}>Add to Cart</button>
                        </div>
                    ))}
                </div>
            </div>
            <div className="categories-container">
                <h2>Categories</h2>
                <ul className="categories-list">
                    {categories.map((category) => (
                        <li key={category._id} className="category-item">
                            {category.name}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Products;
