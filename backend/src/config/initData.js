const categories = [
  {
    name: "Books",
    description: "Collection of various books from different genres"
  },
  {
    name: "Music Albums",
    description: "Selection of iconic music albums"
  },
  {
    name: "Movies",
    description: "Classic and contemporary films"
  },
  {
    name: "Tools",
    description: "Professional tools for home and garden"
  },
  {
    name: "Plants",
    description: "Plants and gardening supplies"
  }
];

const users = [
  {
    firstName: "Admin",
    lastName: "User",
    username: "admin",
    password: "Pa$$word123",
    role: "admin",
    email: "admin@example.com",
    phone: "+1234567890",
    country: "USA",
    city: "New York",
    street: "Admin Street",
    house: 1
  },
  {
    firstName: "Regular",
    lastName: "User",
    username: "user1",
    password: "Pa$$word123",
    role: "user",
    email: "user1@example.com",
    phone: "+1234567891",
    country: "USA",
    city: "New York",
    street: "User Street",
    house: 2
  }
];

const products = [
  // Books
  {
    name: "The Shining by Stephen King",
    description: "An iconic horror novel that delves into the dark psyche of its characters.",
    price: 19.99,
    quantity: 50,
    imagePath: "/img/products/book_default.png"
  },
  {
    name: "1984 by George Orwell",
    description: "A dystopian novel set in a totalitarian society under constant surveillance.",
    price: 14.99,
    quantity: 40,
    imagePath: "/img/products/book_default.png"
  },
  {
    name: "The Catcher in the Rye by J.D. Salinger",
    description: "A classic novel that explores themes of adolescent angst.",
    price: 9.99,
    quantity: 25,
    imagePath: "/img/products/book_default.png"
  },
  {
    name: "To Kill a Mockingbird by Harper Lee",
    description: "A novel about the serious issues of race and injustice in the Deep South.",
    price: 12.99,
    quantity: 35,
    imagePath: "/img/products/book_default.png"
  },
  {
    name: "The Notebook by Nicholas Sparks",
    description: "A romantic novel that explores enduring love and heartbreak.",
    price: 13.99,
    quantity: 22,
    imagePath: "/img/products/book_default.png"
  },

  // Music Albums
  {
    name: "Thriller by Michael Jackson",
    description: "The legendary album that changed the music industry forever.",
    price: 15.99,
    quantity: 30,
    imagePath: "/img/products/album_default.png"
  },
  {
    name: "Back in Black by AC/DC",
    description: "One of the best-selling albums of all time with unforgettable rock anthems.",
    price: 18.99,
    quantity: 20,
    imagePath: "/img/products/album_default.png"
  },

  // Movies
  {
    name: "Inception",
    description: "A mind-bending thriller directed by Christopher Nolan.",
    price: 12.99,
    quantity: 20,
    imagePath: "/img/products/default.png"
  },
  {
    name: "The Matrix",
    description: "A revolutionary sci-fi film that questions reality and existence.",
    price: 10.99,
    quantity: 15,
    imagePath: "/img/products/default.png"
  },
  {
    name: "The Godfather",
    description: "A film that redefined the gangster genre with a compelling story.",
    price: 11.99,
    quantity: 10,
    imagePath: "/img/products/default.png"
  },

  // Tools
  {
    name: "Garden Trowel",
    description: "A durable garden trowel for planting and digging.",
    price: 5.99,
    quantity: 100,
    imagePath: "/img/products/tool_default.png"
  },
  {
    name: "Hammer Pro",
    description: "The ultimate tool for every DIY project.",
    price: 8.99,
    quantity: 100,
    imagePath: "/img/products/tool_default.png"
  },
  {
    name: "Screwdriver Set",
    description: "A versatile set of screwdrivers for various tasks.",
    price: 15.99,
    quantity: 40,
    imagePath: "/img/products/tool_default.png"
  },
  {
    name: "Circular Saw",
    description: "A powerful tool for cutting wood and other materials.",
    price: 149.99,
    quantity: 10,
    imagePath: "/img/products/tool_default.png"
  },

  // Plants
  {
    name: "Plant Care Essentials",
    description: "Everything you need to keep your plants healthy and thriving.",
    price: 24.99,
    quantity: 15,
    imagePath: "/img/products/plant_default.png"
  },
  {
    name: "Potting Mix",
    description: "High-quality potting mix for all types of plants.",
    price: 8.49,
    quantity: 50,
    imagePath: "/img/products/plant_default.png"
  }
];

export { categories, users, products };
