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

# Create .env file with:
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

## API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/users/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "username": "johndoe",
  "password": "SecurePass123!",
  "email": "john@example.com",
  "phone": "+1234567890",
  "country": "USA",
  "city": "New York",
  "street": "Broadway",
  "house": 123,
  "apartment": 45
}

// Response: Sets HTTP-only cookie with JWT token
```

#### Login
```http
POST /api/users/login
Content-Type: application/json

{
  "username": "johndoe",
  "password": "SecurePass123!"
}

// Response: Sets HTTP-only cookie with JWT token
```

#### Logout
```http
POST /api/users/logout

// Response: Clears the token cookie
```

### Product Management

#### Create Product (Admin)
```http
POST /api/products
Content-Type: application/json

{
  "name": "Product Name",
  "description": "Product Description",
  "price": 99.99,
  "quantity": 100,
  "categoryId": "category_id",
  "imagePath": "/images/product.jpg"
}
```

#### Get Products
```http
GET /api/products        # All products
GET /api/products/actual # In-stock products
GET /api/products/:id    # Specific product
```

### Category Management

#### Create Category (Admin)
```http
POST /api/categories
Content-Type: application/json

{
  "name": "Category Name",
  "description": "Category Description"
}
```

#### Get Categories
```http
GET /api/categories
GET /api/categories/:id
GET /api/categories/:id/products
```

### Order Management

#### Create Order
```http
POST /api/users/:id/orders
```

#### Update Order Status (Admin)
```http
PATCH /api/orders/:id
Content-Type: application/json

{
  "status": "shipping"
}
```

### Shopping Cart

#### Add to Cart
```http
POST /api/users/:id/cart
Content-Type: application/json

{
  "productId": "product_id",
  "quantity": 1
}
```

#### View Cart
```http
GET /api/users/:id/cart
```

#### Clear Cart
```http
POST /api/users/:id/cart/clear
```

## Data Validation

The application implements thorough data validation:

### User Data
- Username: Lowercase letters and numbers only
- Password: Minimum 8 characters, must include uppercase, lowercase, number, and special character
- Email: Valid email format
- Phone: International format with + prefix
- Names: Letters and spaces only

### Product Data
- Name: 3-100 characters, alphanumeric with some special characters
- Description: 10-1000 characters
- Price: Positive number
- Quantity: Positive integer

### Order Processing
- Stock verification before order placement
- Automatic stock adjustment
- Status transition validation

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
- Implement service layer pattern
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
Backend `.env` file:
```env
DB_CONNECT = mongodb://<username>:<password>@host:port/dbname
PORT = 3000
SALT_ROUNDS = 1
JWT_SECRET = "your_secret_key"
```

### Running for Development
1. Start MongoDB service
2. Start backend:
   ```bash
   cd backend
   npm install
   node server.js
   ```
3. Start frontend:
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
