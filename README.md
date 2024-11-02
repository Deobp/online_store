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
```
**Database Initialization**

To set up the initial database with default data, such as categories, users, and products, use the following command.

Steps:

- Open a terminal.

- Navigate to the backend directory:

```bash
cd backend
```

- Run the initialization script:
```bash
npm run init-db
```

This script will:

- Connect to the MongoDB database specified in your .env configuration.

- Clear any existing data in the User, Product, and Category collections.

- Populate the database with predefined categories, users, and products.

- Create default Users

The database will be initialized with two default users:

Admin User

Username: admin

Password: Pa$$word123

Role: admin

Regular User

Username: user1

Password: Pa$$word123

Role: user

Note: Make sure to change the default passwords in production environments to ensure security.

```bash
# Start server
node server.js
```

3. Frontend setup
```bash
cd frontend
npm install
npm run dev
```

## Database Schema

### User Schema
```javascript
{
  firstName: {
    type: String,
    required: true,
    match: [/^[A-Za-z\s'-]+$/, "Letters, spaces, hyphens, apostrophes only"],
    minlength: 1,
    maxlength: 50
  },
  lastName: {
    type: String,
    required: true,
    match: [/^[A-Za-z\s'-]+$/, "Letters, spaces, hyphens, apostrophes only"],
    minlength: 1,
    maxlength: 50
  },
  username: {
    type: String,
    required: true,
    unique: true,
    match: [/^[a-z][a-z0-9]*$/, "Start with lowercase, letters and numbers only"],
    minlength: 4,
    maxlength: 16
  },
  password: {
    type: String,
    required: true,
    // Validated through bcrypt with complexity requirements
  },
  role: {
    type: String,
    required: true,
    enum: ["user", "admin"],
    default: "user"
  },
  phone: {
    type: String,
    required: true,
    unique: true,
    match: [/^\+[0-9]+$/, "International format with + prefix"],
    minlength: 10,
    maxlength: 15
  },
  email: {
    type: String,
    required: true,
    unique: true,
    minlength: 5,
    maxlength: 254,
    match: [/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/, "Valid email format"]
  },
  country: String,
  city: String,
  street: String,
  house: Number,
  apartment: Number,
  cart: [{
    productId: ObjectId,
    quantity: Number
  }]
}
```

### Product Schema
```javascript
{
  name: {
    type: String,
    required: true,
    unique: true,
    match: [/^[A-Za-z0-9][A-Za-z0-9\s&,.()/'(-]*[A-Za-z0-9).]$/],
    minlength: 3,
    maxlength: 100
  },
  description: {
    type: String,
    required: true,
    match: [/^[A-Za-z0-9][A-Za-z0-9\s,.!?()&$#@%*+\-"':]*[A-Za-z0-9.!?)]$/],
    minlength: 10,
    maxlength: 1000
  },
  imagePath: {
    type: String,
    required: true,
    match: [/^(https?:\/\/[\w-]+\.[\w-]+\.|\/)?[\w/-]+\.(png|jpg|jpeg)$/i],
    default: "/img/products/default.png"
  },
  price: {
    type: Number,
    required: true,
    min: 0.01
  },
  quantity: {
    type: Number,
    required: true,
    min: 0,
    validate: Number.isInteger
  },
  categoryId: {
    type: ObjectId,
    ref: "Category",
    required: true
  },
  isEnded: {
    type: Boolean,
    required: true,
    default: false
  }
}
```
### Category Schema
```javascript
{
  name: {
    type: String,
    required: true,
    unique: true,
    match: [/^[a-zA-Z0-9-_ ]+$/, "Letters, numbers, hyphens, underscores only"],
    minlength: 2,
    maxlength: 50,
  },
  description: {
    type: String,
    match: [/^[a-zA-Z0-9][a-zA-Z0-9\s,.!?()&$#@%*+\-"':]*[a-zA-Z0-9.]$/],
    minlength: 10,
    maxlength: 500,
    default: "No description."
  }
}
```

### Order Schema
```javascript
{
  userId: {
    type: ObjectId,
    ref: "User",
    required: true
  },
  products: [{
    productId: {
      type: ObjectId,
      ref: "Product",
      required: true
    },
    priceAtPurchase: Number,
    quantity: {
      type: Number,
      default: 1
    }
  }],
  status: {
    type: String,
    enum: ["pending", "shipping", "completed", "cancelled"],
    default: "pending"
  },
  totalPrice: Number,
  createdAt: Date,
  updatedAt: Date
}
```

## Security Features

### Authentication Implementation
- JWT tokens stored in HTTP-only cookies
- Token verification on protected routes
- Role-based access control (Admin/User)
- Password hashing using bcrypt
- Error handling for invalid tokens

### Cookie Settings
```javascript
res.cookie("token", token, {
  httpOnly: true,    // Prevents JavaScript access
  maxAge: 3600000,   // 1 hour expiration
  // secure: true,   // Uncomment in production (HTTPS only)
});
```

### Server Security
```javascript
// CORS configuration
app.use(cors({
  origin: true,
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Helmet security headers
app.use(helmet());

// JSON parser with validation
app.use(express.json({
  verify: (req, res, buf) => {
    if (buf.length > 0 && req.headers["content-type"]?.includes("application/json")) {
      JSON.parse(buf);
    }
  }
}));
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

Response: 
- 201: User created
- 400: Validation error
- 409: Username/email/phone exists
```

#### Login
```http
POST /api/users/login
Content-Type: application/json

{
  "username": "johndoe",
  "password": "SecurePass123!"
}

Response:
- 200: Success + JWT cookie
- 401: Invalid credentials
```

#### Logout
```http
POST /api/users/logout

Response:
- 200: Cookie cleared
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

Response:
- 201: Product created
- 400: Validation error
- 403: Not admin
```

#### Get Products
```http
GET /api/products        # All products
GET /api/products/actual # In-stock products (isEnded: false)
GET /api/products/:id    # Specific product

Response:
- 200: Success
- 404: Product not found (for /:id)
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

Response:
- 201: Category created
- 400: Validation error
- 403: Not admin
```

#### Get Categories
```http
GET /api/categories         # All categories
GET /api/categories/:id     # Specific category
GET /api/categories/:id/products  # Products in category

Response:
- 200: Success
- 404: Category not found
```

### Order Management

#### Create Order
```http
POST /api/users/:id/orders

Response:
- 201: Order created
- 400: Empty cart
- 404: User not found/Product not found
```

#### Update Order Status
```http
PATCH /api/orders/:id
Content-Type: application/json

{
  "status": "shipping"
}

Response:
- 200: Status updated
- 400: Invalid status
- 403: Not authorized
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

Response:
- 200: Added to cart
- 400: Invalid quantity
- 404: Product not found
```

#### View Cart
```http
GET /api/users/:id/cart

Response:
- 200: Cart contents
- 404: User not found
```

#### Clear Cart
```http
POST /api/users/:id/cart/clear

Response:
- 200: Cart cleared
- 404: User not found
```

## Data Validation

The application implements thorough data validation using regular expressions and Mongoose validation:

### User Data
```javascript
// Names (firstName, lastName)
/^[A-Za-z\s'-]+$/
- English letters
- Spaces
- Apostrophes (for names like O'Connor)
- Hyphens (for double-barreled names)

// Username
/^[a-z][a-z0-9]*$/
- Must start with lowercase letter
- Can contain lowercase letters and numbers
- No special characters

// Password
- At least one lowercase letter
- At least one uppercase letter
- At least one number
- At least one special character
- Length between 8 and 128 characters

// Phone
/^\+[0-9]+$/
- Must start with plus
- Only numbers after plus
- Length between 10 and 15 characters

// Email
/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/
- Standard email format validation

// Address (country, city, street)
/^[A-Za-z\s\-.']+$/
- English letters
- Spaces
- Hyphens and periods
- Apostrophes allowed
```

### Product Data
```javascript
// Name
/^[A-Za-z0-9][A-Za-z0-9\s&,.()/'(-]*[A-Za-z0-9).]$/
- Must start with letter or number
- Can contain spaces, &, punctuation, brackets
- Must end with letter, number, bracket, or period

// Description
/^[A-Za-z0-9][A-Za-z0-9\s,.!?()&$#@%*+\-"':]*[A-Za-z0-9.!?)]$/
- Must start with letter or number
- Allows punctuation and special characters
- Must end properly

// Image Path
/^(https?:\/\/[\w-]+\.[\w-]+\.|\/)?[\w/-]+\.(png|jpg|jpeg)$/i
- Allows both URLs and local paths
- Must end with valid image extension
```

### Category Data
```javascript
// Name
/^[a-zA-Z0-9-_ ]+$/
- Letters and numbers
- Hyphens and underscores
- Spaces allowed

// Description
- Similar to product description
- Minimum 10 characters
- Maximum 500 characters
```

### Order Processing
- Stock verification before order placement
- Automatic stock adjustment
- Status transition validation:
  - Admin: pending → shipping/cancelled, shipping → completed
  - User: pending → cancelled only

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
