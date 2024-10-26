// Categories.jsx
import React from 'react';

const Categories = ({ categories, onCategorySelect }) => {
    return (
        <div className="categories-container">
            <h2>Categories</h2>
            <ul className="categories-list">
                {categories.map((category) => (
                    <li 
                        key={category._id} 
                        onClick={() => onCategorySelect(category._id)} 
                        style={{ cursor: 'pointer' }}
                    >
                        {category.name}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Categories;
