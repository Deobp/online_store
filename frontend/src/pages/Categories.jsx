import { useEffect, useState } from 'react';
import './Products.css';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [selectedCategory]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const url = selectedCategory 
                ? `http://localhost:3000/api/categories/${selectedCategory}/products`
                : 'http://localhost:3000/api/products';

            const response = await fetch(url);
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
                    {products.length > 0 ? (
                        products.map((product) => (
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
