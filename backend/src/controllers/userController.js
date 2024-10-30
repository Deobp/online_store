import Product from "../models/Product.js";
import User from "../models/User.js";
import jwt from "../utils/jwt.js";
import bcrypt from "bcrypt";

// getting all users
export const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    if (!users.length)
      return res.status(200).json({ message: "no users in db" });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// getting one particular user
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user.id !== id) {
      if (req.user.role !== "admin")
        return res.status(401).json({
          message: "Access denied, you are not admin or this is not your data.",
        });
    }

    const user = await User.findById(id);

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (error) {
    // invalid id
    if (error.name === "CastError")
      return res
        .status(400)
        .json({ message: "Invalid userId", additionalInfo: error.message });

    res.status(500).json({ message: error.message });
  }
};

// full updating of user
export const updateUser = async (req, res) => {
  try {
    const receivedKeys = Object.keys(req.body); // collecting keys to count

    // ignoring empty body
    if (receivedKeys.length === 0)
      return res.status(400).json({ message: "No parameters in body." });

    // we are expecting not more than 11 parameters
    if (receivedKeys.length > 11)
      return res.status(400).json({
        message: "Too many parameters. Not more than 6 are expected.",
      });

    // we are expecting not less than 10 parameters
    if (receivedKeys.length < 10)
      return res
        .status(400)
        .json({ message: "Not enough parameters. Should be min. 10." });

    // parameters are strictly defined
    const allowedParams = [
      "firstName",
      "lastName",
      "username",
      "password",
      "email",
      "phone",
      "country",
      "city",
      "street",
      "house",
      "apartment",
    ];

    // if there is smth else...
    const isBodyValid = receivedKeys.every(function (key) {
      return allowedParams.includes(key);
    });

    // ...BAD REQUEST
    if (!isBodyValid)
      return res.status(400).json({ message: "Invalid parameters in body" });

    // collecting body parameters
    const {
      firstName,
      lastName,
      username,
      password,
      email,
      phone,
      country,
      city,
      street,
      house,
      apartment,
    } = req.body;

    // if firstName is missing
    if (firstName === undefined || firstName === null)
      return res
        .status(400)
        .json({ message: "Parameter 'firstName' is missing" });

    // if lastName is missing
    if (lastName === undefined || lastName === null)
      return res
        .status(400)
        .json({ message: "Parameter 'lastName' is missing" });

    // if username is missing
    if (username === undefined || username === null)
      return res
        .status(400)
        .json({ message: "Parameter 'username' is missing" });

    // if password is missing
    if (password === undefined || password === null)
      return res
        .status(400)
        .json({ message: "Parameter 'password' is missing" });

    // if email is missing
    if (email === undefined || email === null)
      return res.status(400).json({ message: "Parameter 'email' is missing" });

    // if phone is missing
    if (phone === undefined || phone === null)
      return res.status(400).json({ message: "Parameter 'phone' is missing" });

    // if country is missing
    if (country === undefined || country === null)
      return res
        .status(400)
        .json({ message: "Parameter 'country' is missing" });

    // if city is missing
    if (city === undefined || city === null)
      return res.status(400).json({ message: "Parameter 'city' is missing" });

    // if street is missing
    if (street === undefined || street === null)
      return res.status(400).json({ message: "Parameter 'street' is missing" });

    // if house is missing
    if (house === undefined || house === null)
      return res.status(400).json({ message: "Parameter 'house' is missing" });

    // validation of body parameters
    if (typeof house !== "number")
      return res
        .status(400)
        .json({ message: "Body parameter 'house' must be a number." });

    if (house < 1)
      return res
        .status(400)
        .json({ message: "Body parameter 'house' must be >= 1." });

    if (!Number.isInteger(house))
      return res.status(400).json({ message: "House must be an Integer." });

    // optional parameter
    if (apartment !== undefined && typeof apartment !== "number")
      return res
        .status(400)
        .json({ message: "Body parameter 'apartment' must be a number." });

    if (apartment < 1)
      return res
        .status(400)
        .json({ message: "Body parameter 'apartment' must be >= 1." });

    if (!Number.isInteger(apartment))
      return res.status(400).json({ message: "apartment must be an Integer." });

    if (typeof firstName !== "string")
      return res
        .status(400)
        .json({ message: "Body parameter 'firstName' must be a string." });

    if (typeof lastName !== "string")
      return res
        .status(400)
        .json({ message: "Body parameter 'lastName' must be a string." });

    if (typeof username !== "string")
      return res
        .status(400)
        .json({ message: "Body parameter 'username' must be a string." });

    if (typeof password !== "string")
      return res
        .status(400)
        .json({ message: "Body parameter 'password' must be a string." });

    if (typeof email !== "string")
      return res
        .status(400)
        .json({ message: "Body parameter 'email' must be a string." });

    if (typeof phone !== "string")
      return res
        .status(400)
        .json({ message: "Body parameter 'phone' must be a string." });

    if (typeof country !== "string")
      return res
        .status(400)
        .json({ message: "Body parameter 'country' must be a string." });

    if (typeof city !== "string")
      return res
        .status(400)
        .json({ message: "Body parameter 'city' must be a string." });

    if (typeof street !== "string")
      return res
        .status(400)
        .json({ message: "Body parameter 'street' must be a string." });

    const { id } = req.params;

    if (req.user.id !== id) {
      if (req.user.role !== "admin")
        return res.status(401).json({
          message: "Access denied, you are not admin or this is not your data.",
        });
    }

    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedUser)
      return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "User successfully updated", updatedUser });
  } catch (error) {
    if (error.name === "ValidationError" || error.code === 11000)
      return res.status(400).json({ message: error.message });

    res.status(500).json({ message: error.message });
  }
};

// deleting user
export const deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser)
      return res.status(404).json({ message: "User not found" });
    res
      .status(200)
      .json({ message: "User deleted successfully", deletedUser: deletedUser });
  } catch (error) {
    // invalid id
    if (error.name === "CastError")
      return res
        .status(400)
        .json({ message: "Invalid userId", additionalInfo: error.message });

    res.status(500).json({ message: error.message });
  }
};

// adding to cart
export const addToCart = async (req, res) => {
  const receivedKeys = Object.keys(req.body); // collecting keys to count

  // ignoring empty body
  if (receivedKeys.length === 0)
    return res.status(400).json({ message: "No parameters in body." });

  // we are expecting not more than 2 parameters
  if (receivedKeys.length > 2)
    return res.status(400).json({
      message: "Too many parameters. Not more than 6 are expected.",
    });

  // we are expecting not less than 2 parameters
  if (receivedKeys.length < 2)
    return res
      .status(400)
      .json({ message: "Not enough parameters. Should be 2." });

  // parameters are strictly defined
  const allowedParams = ["productId", "quantity"];

  // if there is smth else...
  const isBodyValid = receivedKeys.every(function (key) {
    return allowedParams.includes(key);
  });

  // ...BAD REQUEST
  if (!isBodyValid)
    return res.status(400).json({ message: "Invalid parameters in body" });

  let { id } = req.params;

  if (id === "me") id = req.user.id;

  if (req.user.id !== id) {
    if (req.user.role !== "admin")
      return res.status(403).json({
        message: "Access denied, you are not admin or this is not your data.",
      });
  }

  const { productId, quantity } = req.body;

  // if productId is missing
  if (productId === undefined || productId === null)
    return res
      .status(400)
      .json({ message: "Parameter 'productId' is missing" });

  // if quantity is missing
  if (quantity === undefined || quantity === null)
    return res.status(400).json({ message: "Parameter 'quantity' is missing" });

  if (typeof productId !== "string")
    return res
      .status(400)
      .json({ message: "Body parameter 'productId' must be a string." });

  if (typeof quantity !== "number")
    return res
      .status(400)
      .json({ message: "Body parameter 'quantity' must be a number." });

  if (quantity < 1)
    return res
      .status(400)
      .json({ message: "Body parameter 'quantity' must be >= 1." });

  try {
    const product = await Product.findById(productId);

    if (!product)
      return res
        .status(404)
        .json({ message: "Product with this id not found" });

    if (product.isEnded)
      return res.status(400).json({ message: "Out of stock." });

    if (parseInt(quantity) > product.quantity)
      return res.status(400).json({ message: "Not enough products in stock." });

    const user = await User.findById(id);

    if (!user)
      return res.status(404).json({ message: "User with this ID not found" });

    await user.addToCart(productId, quantity, product.quantity);

    res.status(200).json({ message: "Product added to cart", cart: user.cart });
  } catch (error) {
    if (error.name === "CastError" || error.name === "StockError")
      return res.status(400).json({ message: error.message });

    res.status(500).json({ message: error.message });
  }
};

// clearing cart
export async function clearCart(req, res) {
  
  
  let { id } = req.params;

  if (id === "me") id = req.user.id;

  if (req.user.id !== id) {
    if (req.user.role !== "admin")
      return res.status(403).json({
        message: "Access denied, you are not admin or this is not your data.",
      });
  }

  try {
    const user = await User.findById(id);

    if (!user)
      return res.status(404).json({ message: "User with this ID not found" });

    await user.clearCart();

    res
      .status(200)
      .json({ message: "User's cart is cleared.", cart: user.cart });
  } catch (error) {
    // invalid id
    if (error.name === "CastError")
      return res
        .status(400)
        .json({ message: "Invalid userId", additionalInfo: error.message });

    res.status(500).json({ message: error.message });
  }
}

export async function viewCart(req, res) {
  let { id } = req.params;

  if (id === "me") id = req.user.id;

  if (req.user.id !== id) {
    if (req.user.role !== "admin")
      return res.status(403).json({
        message: "Access denied, you are not admin or this is not your data.",
      });
  }

  const user = await User.findById(id);

  if (!user)
    return res.status(404).json({ message: "User with this ID not found" });

  const result = await user.getCart();

  res.status(200).json({ cart: result });
}

export const updatePassword = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user.id !== id) {
      if (req.user.role !== "admin")
        return res.status(403).json({
          message: "Access denied, you are not admin or this is not your data.",
        });
    }

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const { password } = req.body;

    if (!password)
      return res.status(400).json({ message: "Password is missing" });

    if (bcrypt.compareSync(password, user.password))
      return res
        .status(400)
        .json({ message: "Password didn't change. You already use it." });

    await user.updatePassword(password);
    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    if (
      error.name === "ValidationError" ||
      error.message.includes("Invalid value")
    )
      return res.status(400).json({ message: error.message });
    res.status(500).json({ message: error.message });
  }
};

export const updateFirstName = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user.id !== id) {
      if (req.user.role !== "admin")
        return res.status(403).json({
          message: "Access denied, you are not admin or this is not your data.",
        });
    }

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const { firstName } = req.body;

    if (!firstName)
      return res.status(400).json({ message: "First name is missing" });

    const result = await user.updateFirstName(firstName);
    res
      .status(200)
      .json({ message: "First name updated successfully", result });
  } catch (error) {
    if (
      error.message.includes("didn't change") ||
      error.name === "ValidationError" ||
      error.code === 11000
    )
      return res.status(400).json({ message: error.message });
    res.status(500).json({ message: error.message });
  }
};

export const updateLastName = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user.id !== id) {
      if (req.user.role !== "admin")
        return res.status(403).json({
          message: "Access denied, you are not admin or this is not your data.",
        });
    }

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const { lastName } = req.body;

    if (!lastName)
      return res.status(400).json({ message: "Last name is missing" });

    const result = await user.updateLastName(lastName);
    res.status(200).json({ message: "Last name updated successfully", result });
  } catch (error) {
    if (
      error.message.includes("didn't change") ||
      error.name === "ValidationError" ||
      error.code === 11000
    )
      return res.status(400).json({ message: error.message });
    res.status(500).json({ message: error.message });
  }
};

export const updateUsername = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user.id !== id) {
      if (req.user.role !== "admin")
        return res.status(403).json({
          message: "Access denied, you are not admin or this is not your data.",
        });
    }

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const { username } = req.body;

    if (!username)
      return res.status(400).json({ message: "Username is missing" });

    const result = await user.updateUsername(username);
    res.status(200).json({ message: "Username updated successfully", result });
  } catch (error) {
    if (
      error.message.includes("didn't change") ||
      error.name === "ValidationError" ||
      error.code === 11000
    )
      return res.status(400).json({ message: error.message });
    res.status(500).json({ message: error.message });
  }
};

export const updatePhone = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user.id !== id) {
      if (req.user.role !== "admin")
        return res.status(403).json({
          message: "Access denied, you are not admin or this is not your data.",
        });
    }

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const { phone } = req.body;

    if (!phone)
      return res.status(400).json({ message: "Phone number is missing" });

    const result = await user.updatePhone(phone);
    res
      .status(200)
      .json({ message: "Phone number updated successfully", result });
  } catch (error) {
    if (
      error.message.includes("didn't change") ||
      error.name === "ValidationError" ||
      error.code === 11000
    )
      return res.status(400).json({ message: error.message });
    res.status(500).json({ message: error.message });
  }
};

export const updateEmail = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user.id !== id) {
      if (req.user.role !== "admin")
        return res.status(403).json({
          message: "Access denied, you are not admin or this is not your data.",
        });
    }

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const { email } = req.body;

    if (!email) return res.status(400).json({ message: "email is missing" });

    const result = await user.updateEmail(email);
    res.status(200).json({ message: "email updated successfully", result });
  } catch (error) {
    if (
      error.message.includes("didn't change") ||
      error.name === "ValidationError" ||
      error.code === 11000
    )
      return res.status(400).json({ message: error.message });
    res.status(500).json({ message: error.message });
  }
};

export const updateCountry = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user.id !== id) {
      if (req.user.role !== "admin")
        return res.status(403).json({
          message: "Access denied, you are not admin or this is not your data.",
        });
    }

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const { country } = req.body;

    if (!country)
      return res.status(400).json({ message: "Country is missing" });

    const result = await user.updateCountry(country);
    res.status(200).json({ message: "Country updated successfully", result });
  } catch (error) {
    if (
      error.message.includes("didn't change") ||
      error.name === "ValidationError"
    )
      return res.status(400).json({ message: error.message });
    res.status(500).json({ message: error.message });
  }
};

export const updateCity = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user.id !== id) {
      if (req.user.role !== "admin")
        return res.status(403).json({
          message: "Access denied, you are not admin or this is not your data.",
        });
    }

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const { city } = req.body;

    if (!city) return res.status(400).json({ message: "City is missing" });

    const result = await user.updateCity(city);
    res.status(200).json({ message: "City updated successfully", result });
  } catch (error) {
    if (
      error.message.includes("didn't change") ||
      error.name === "ValidationError"
    )
      return res.status(400).json({ message: error.message });
    res.status(500).json({ message: error.message });
  }
};

export const updateStreet = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user.id !== id) {
      if (req.user.role !== "admin")
        return res.status(403).json({
          message: "Access denied, you are not admin or this is not your data.",
        });
    }

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const { street } = req.body;

    if (!street) return res.status(400).json({ message: "Street is missing" });

    const result = await user.updateStreet(street);
    res.status(200).json({ message: "Street updated successfully", result });
  } catch (error) {
    if (
      error.message.includes("didn't change") ||
      error.name === "ValidationError"
    )
      return res.status(400).json({ message: error.message });
    res.status(500).json({ message: error.message });
  }
};

export const updateHouse = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user.id !== id) {
      if (req.user.role !== "admin")
        return res.status(403).json({
          message: "Access denied, you are not admin or this is not your data.",
        });
    }

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const { house } = req.body;

    if (!house)
      return res.status(400).json({ message: "House number is missing" });

    const result = await user.updateHouse(house);
    res
      .status(200)
      .json({ message: "House number updated successfully", result });
  } catch (error) {
    if (
      error.message.includes("didn't change") ||
      error.name === "ValidationError"
    )
      return res.status(400).json({ message: error.message });
    res.status(500).json({ message: error.message });
  }
};

export const updateApartment = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user.id !== id) {
      if (req.user.role !== "admin")
        return res.status(403).json({
          message: "Access denied, you are not admin or this is not your data.",
        });
    }

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const { apartment } = req.body;

    if (!apartment)
      return res.status(400).json({ message: "Apartment number is missing" });

    const result = await user.updateApartment(apartment);
    res
      .status(200)
      .json({ message: "Apartment number updated successfully", result });
  } catch (error) {
    if (
      error.message.includes("didn't change") ||
      error.name === "ValidationError"
    )
      return res.status(400).json({ message: error.message });
    res.status(500).json({ message: error.message });
  }
};

export async function verifyUser(req, res, next) {
  const user = await User.findOne({ username: req.body.username });
  if (!user || !bcrypt.compareSync(req.body.password, user.password)) {
    return res.status(401).json({ message: "Invalid credentials." });
  }

  const token = jwt.createToken(user);
  if (!token)
    return res.status(500).json({ message: "Error generating token" });
  //res.json({ token })
  res.cookie("token", token, {
    httpOnly: true,
    maxAge: 3600000, // 1h
  });

  res.status(200).json({ message: "User authorized" /*, token*/ });
}

export async function registerUser(req, res, next) {
  const {
    firstName,
    lastName,
    username,
    password,
    email,
    phone,
    country,
    city,
    street,
    house,
    apartment,
  } = req.body;

  if (!firstName)
    return res.status(400).json({ message: "First name is missing." });

  if (!lastName)
    return res.status(400).json({ message: "Last name is missing." });

  if (!username)
    return res.status(400).json({ message: "Username is missing." });

  if (!password)
    return res.status(400).json({ message: "Password is missing." });

  if (!email) return res.status(400).json({ message: "email is missing." });

  if (!phone)
    return res.status(400).json({ message: "Phone number is missing." });

  if (!country) return res.status(400).json({ message: "Country is missing." });

  if (!city) return res.status(400).json({ message: "City is missing." });

  if (!street) return res.status(400).json({ message: "Street is missing." });

  if (!house) return res.status(400).json({ message: "House is missing." });

  let user = await User.findOne({ username });
  if (user) return res.status(400).json({ message: "This username is busy." });

  user = await User.findOne({ email });
  if (user) return res.status(400).json({ message: "This email is busy." });

  user = await User.findOne({ phone });
  if (user)
    return res.status(400).json({ message: "This phone number is busy." });

  try {
    const newUser = new User({
      firstName,
      lastName,
      username,
      password,
      email,
      phone,
      country,
      city,
      street,
      house,
      apartment,
    });

    await newUser.save();

    const token = jwt.createToken(newUser);
    if (!token)
      return res.status(500).json({ message: "Error generating token" });
    //res.json({ token })
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 3600000, // 1h
    });
    res
      .status(201)
      .json({ message: "User registered successfully" /*, token */ });
  } catch (error) {
    if (error.name === "ValidationError" || error.code === 11000)
      return res.status(400).json({ message: error.message });
    res.status(500).json({ message: error.message });
  }
}

export async function logout(req, res, next) {
  try {
    // clear cookie with token
    res.clearCookie("token", {
      httpOnly: true,
    });

    return res.status(200).json({ message: "Logout: success." });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}
