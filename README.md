To run frontend in folder frontend run commands:
npm i
npm run dev

USERS (create, update):
    (id),
    [role].
    firstName,
    lastName,
    username,
    password,
    email,
    address,
    phone

PRODUCTS (create, update, delete, display):
    (id)
    title,
    price,
    description,
    quantity,
    categoryId

CATEGORIES (create, delete, display):
    (id)
    name,
    description

ORDERS (CRUD):
    (id)
    products [{products._id: buyQuantity}],
    getSum(),
    status,
    payment: boolean
    

