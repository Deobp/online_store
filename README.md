# E-Commerce Educational Project

A full-stack e-commerce application built with MERN stack (MongoDB, Express.js, React, Node.js) that demonstrates modern web development practices including authentication, authorization, data validation, and error handling.

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Security Features](#security-features)
- [Testing](#testing)
- [Current Status and Roadmap](#current-status-and-roadmap)
- [Contributing](#contributing)
- [Development Setup](#development-setup)
- [Learn From This Project](#learn-from-this-project)
- [Support](#support)

## Features

### Security
- JWT-based authentication with HTTP-only cookies
- Role-based authorization (Admin/User)
- Password hashing with bcrypt
- Input validation and sanitization
- CORS and Helmet security headers

### Users
- Registration and authentication
- Profile management with address details
- Shopping cart functionality
- Order placement and history

### Products
- Comprehensive product management
- Category organization
- Stock tracking
- Image management

### Orders
- Order lifecycle management
- Status tracking (pending → shipping → completed)
- Order cancellation with stock adjustment

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcrypt for password hashing
- Cookie-parser for cookie management
- Helmet for security headers
- CORS for cross-origin resource sharing

### Frontend
- React 18
- Vite
- React Router v6
- Axios for API calls
- ESLint

## Installation

1. Clone the repository
```bash
git clone [repository-url]
cd [project-name]
```

2. Backend setup
```bash
cd backend
npm install

# Create .env file in src/config with:
DB_CONNECT = mongodb://<username>:<password>@host:port/dbname
PORT = 3000
SALT_ROUNDS = 1
JWT_SECRET = "your_secret_key"

# Start server
node server.js
```

3. Frontend setup
```bash
cd frontend
npm install
npm run dev
```

## API Documentation

### Authentication
```http
POST /api/users/register   # Create new user account
POST /api/users/login      # Get authentication token
POST /api/users/logout     # Clear authentication token
```

### Users
```http
GET    /api/users         # List all users (admin)
GET    /api/users/:id     # Get user details
PUT    /api/users/:id     # Update user
DELETE /api/users/:id     # Delete user
```

### Products
```http
POST   /api/products      # Create product (admin)
GET    /api/products      # List all products
GET    /api/products/actual # List in-stock products
GET    /api/products/:id  # Get product details
PUT    /api/products/:id  # Update product (admin)
DELETE /api/products/:id  # Delete product (admin)
```

### Shopping Cart
```http
POST   /api/users/:id/cart      # Add to cart
GET    /api/users/:id/cart      # View cart
POST   /api/users/:id/cart/clear # Clear cart
```

### Orders
```http
POST   /api/users/:id/orders    # Create order from cart
GET    /api/orders              # List all orders (admin)
GET    /api/orders/:id          # Get order details
PATCH  /api/orders/:id          # Update order status
```

## Database Schema

### User
```javascript
{
  firstName: String,     // Required, letters and hyphens, 1-50 chars
  lastName: String,      // Required, letters and hyphens, 1-50 chars
  username: String,      // Required, unique, lowercase letters and numbers
  password: String,      // Required, hashed, min 8 chars with complexity rules
  role: String,         // "user" or "admin"
  email: String,        // Required, unique, valid email format
  phone: String,        // Required, unique, international format (+numbers)
  country: String,      // Required, letters and spaces
  city: String,         // Required, letters and spaces
  street: String,       // Required, letters and spaces
  house: Number,        // Required, positive integer
  apartment: Number,    // Optional, positive integer
  cart: [{ productId, quantity }]
}
```

### Product
```javascript
{
  name: String,        // Required, unique, 3-100 chars
  description: String, // Required, 10-1000 chars
  price: Number,       // Required, positive
  quantity: Number,    // Required, integer, min 0
  categoryId: ObjectId,// Required, reference to Category
  imagePath: String,   // Required, PNG/JPG/JPEG path
  isEnded: Boolean    // Out of stock flag
}
```

### Category
```javascript
{
  name: String,        // Required, unique, 2-50 chars, alphanumeric
  description: String  // Optional, 10-500 chars
}
```

### Order
```javascript
{
  userId: ObjectId,    // Reference to User
  products: [{        // Array of ordered products
    productId: ObjectId,
    quantity: Number,
    priceAtPurchase: Number
  }],
  status: String,     // pending/shipping/completed/cancelled
  totalPrice: Number,
  createdAt: Date
}
```

## Security Features

### Authentication Implementation
- JWT tokens stored in HTTP-only cookies
- Secure session management
- Protection against XSS attacks
- CSRF protection through cookies
- Automatic token cleanup on logout

### Cookie Settings
```javascript
res.cookie("token", token, {
  httpOnly: true,    // Prevents JavaScript access
  maxAge: 3600000,   // 1 hour expiration
  // secure: true,   // Uncomment in production (HTTPS only)
  // sameSite: 'strict'  // CSRF protection
});
```

## Testing

The API endpoints have been tested using Postman.

### Postman Configuration
1. Enable cookie handling in Postman:
   - Go to Settings → General
   - Enable "Automatically follow redirects"
   - Enable "Send cookies"

2. Testing authentication flow:
   - Send login request
   - Cookies will be automatically handled
   - Subsequent requests will include the cookie

### Test Scenarios
1. Authentication Flow:
   - Register new user
   - Login and verify cookie is set
   - Access protected route
   - Logout and verify cookie is cleared

2. Authorization Tests:
   - Test admin routes with regular user cookie
   - Verify appropriate error responses
   - Test permission-based functionalities

## Current Status and Roadmap

### Current Status
- ✅ Backend API implemented
- ✅ Database models and relationships established
- ✅ Authentication and authorization
- ✅ Basic security measures
- ✅ API testing via Postman
- 🚧 Frontend development in progress

### Planned Improvements

#### Code Refactoring
- Implement business logic layer through services
- Add input validation middleware
- Improve error handling
- Add request rate limiting
- Implement logging system
- Add API documentation using Swagger/OpenAPI

#### Frontend Development
- Complete React implementation
- Add Redux for state management
- Implement responsive design
- Add user interface for all API features
- Include admin dashboard
- Add cart visualization
- Implement order tracking

#### Security Enhancements
- Add refresh tokens
- Implement password reset
- Add email verification
- Enhance input sanitization
- Add request validation middleware

#### Testing
- Add unit tests
- Implement integration tests
- Add end-to-end testing
- Create automated test suite
- Add performance testing

## Contributing

This is an educational project open for contributions. Areas where you can contribute:

1. Code Refactoring
   - Improving code organization
   - Enhancing error handling
   - Adding comments and documentation

2. Frontend Development
   - Implementing UI components
   - Adding responsive design
   - Improving user experience

3. Testing
   - Writing unit tests
   - Creating integration tests
   - Improving test coverage

4. Documentation
   - Improving API documentation
   - Adding code comments
   - Creating user guides

### How to Contribute
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Development Setup

### Prerequisites
- Node.js 
- MongoDB
- Postman (for testing)
- Git

### Environment Variables
Backend `.env` file in `src/config/.env`:
```env
DB_CONNECT = mongodb://<username>:<password>@host:port/dbname
PORT = 3000
SALT_ROUNDS = 1
JWT_SECRET = "your_secret_key"
```

### Initial Data Setup
The project includes initial data setup with categories, products, and user accounts.

1. Default Categories:
   - Books
   - Music Albums
   - Movies
   - Tools
   - Plants

2. Default Users:
```javascript
// Admin account
{
  username: "admin",
  password: "Pa$$word123",
  role: "admin"
}

// Regular user account
{
  username: "user1",
  password: "Pa$$word123",
  role: "user"
}
```

3. Sample products in each category (books, albums, movies, tools, plants)

To initialize the database with sample data:
```bash
# From the backend directory
npm run init-db
```

This will:
- Clear existing data
- Create categories
- Add sample products
- Create default user accounts

### Running for Development
1. Start MongoDB service
2. Initialize database with sample data:
   ```bash
   cd backend
   npm run init-db
   ```
3. Start backend:
   ```bash
   npm install
   node server.js
   ```
4. Start frontend:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## Learn From This Project

This project demonstrates several key concepts in modern web development:

1. Backend Development
   - RESTful API design
   - Authentication/Authorization
   - Database modeling
   - Input validation
   - Error handling

2. Security Practices
   - JWT implementation
   - Password hashing
   - Role-based access control
   - Security headers
   - Input sanitization

3. Database Design
   - MongoDB schema design
   - Relationships in NoSQL
   - Data validation
   - Indexing

4. API Development
   - RESTful principles
   - Status codes
   - Error handling
   - Request/Response formatting

## Support

For support, please:
1. Check existing documentation
2. Review closed issues
3. Open a new issue with detailed description
4. Use descriptive titles and provide examples

## License

MIT License

Copyright (c) 2024

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
