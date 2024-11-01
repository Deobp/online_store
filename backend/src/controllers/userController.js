import Product from "../models/Product.js";
import User from "../models/User.js";
import { UserError } from "../utils/errors.js";
import jwt from "../utils/jwt.js";
import bcrypt from "bcrypt";

// getting all users
export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find();

    if (!users.length)
      return res.status(200).json({ message: "List of users is empty", users });

    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

// getting one particular user
export const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;

    //if (id === "me") id = req.user.id;

    if (req.user.id !== id) {
      if (req.user.role !== "admin")
        return res.status(401).json({
          message: "Access denied, you are not admin or this is not your data.",
        });
    }

    const user = await User.findById(id);

    if (!user) return next(new UserError("User not found.", 404));

    res.status(200).json(user);
  } catch (error) {
    // invalid id
    /*if (error.name === "CastError")
      return res
        .status(400)
        .json({ message: "Invalid userId", additionalInfo: error.message });*/

    next(error);
  }
};

// full updating of user
export const fullUpdateUserById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (req.user.id !== id) {
      if (req.user.role !== "admin")
        return next(new UserError("Access denied.", 401));
    }

    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) return next(new UserError("User not found.", 404));

    res.status(200).json({ message: "User successfully updated", updatedUser });
  } catch (error) {
    // validation error from mongo
    if (error.name === "ValidationError")
      return next(new UserError(error.message));

    // duplicate value error from mongo
    if (error.code === 11000)
      return next(
        new UserError(
          "Duplicate value. Body parameters 'username', 'email', 'phone' must be unique."
        )
      );

    next(error);
  }
};

// partial update of one user
export const partialUpdateUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const params = req.body;

    if (req.user.id !== id) {
      if (req.user.role !== "admin")
        return next(new UserError("Access denied.", 401));
    }

    const user = await User.findById(id);
    if (!user) return next(new UserError("User not found.", 404));

    // looking for changes
    let changesControl = [];

    if (params.firstName !== undefined) {
      if (user.firstName !== params.firstName) {
        await user.updateFirstName(params.firstName);
        changesControl.push("User's first name updated.");
      } else
        changesControl.push(
          "User's first name didn't change. Same value entered."
        );
    }

    if (params.lastName !== undefined) {
      if (user.lastName !== params.lastName) {
        await user.updateLastName(params.lastName);
        changesControl.push("User's last name updated.");
      } else
        changesControl.push(
          "User's last name didn't change. Same value entered."
        );
    }

    if (params.username !== undefined) {
      if (user.username !== params.username) {
        await user.updateUsername(params.username);
        changesControl.push("username updated.");
      } else changesControl.push("username didn't change. Same value entered.");
    }

    if (params.password !== undefined) {
      if (!bcrypt.compareSync(params.password, user.password)) {
        await user.updatePassword(params.password);
        changesControl.push("User's password updated.");
      } else
        changesControl.push(
          "User's password didn't change. Same value entered."
        );
    }

    if (params.email !== undefined) {
      if (user.email !== params.email) {
        await user.updateEmail(params.email);
        changesControl.push("User's email updated.");
      } else
        changesControl.push("User's email didn't change. Same value entered.");
    }

    if (params.phone !== undefined) {
      if (user.phone !== params.phone) {
        await user.updatePhone(params.phone);
        changesControl.push("User's phone updated.");
      } else
        changesControl.push("User's phone didn't change. Same value entered.");
    }

    if (params.country !== undefined) {
      if (user.country !== params.country) {
        await user.updateCountry(params.country);
        changesControl.push("User's country updated.");
      } else
        changesControl.push(
          "User's country didn't change. Same value entered."
        );
    }

    if (params.city !== undefined) {
      if (user.city !== params.city) {
        await user.updateCity(params.city);
        changesControl.push("User's city updated.");
      } else
        changesControl.push("User's city didn't change. Same value entered.");
    }

    if (params.street !== undefined) {
      if (user.street !== params.street) {
        await user.updateStreet(params.street);
        changesControl.push("User's street updated.");
      } else
        changesControl.push("User's street didn't change. Same value entered.");
    }

    if (params.house !== undefined) {
      if (user.house !== params.house) {
        await user.updateHouse(params.house);
        changesControl.push("User's house number updated.");
      } else
        changesControl.push(
          "User's house number didn't change. Same value entered."
        );
    }

    if (params.apartment !== undefined) {
      if (user.apartment !== params.apartment) {
        await user.updateApartment(params.apartment);
        changesControl.push("User's apartment number updated.");
      } else
        changesControl.push(
          "User's apartment number didn't change. Same value entered."
        );
    }

    res.status(200).json({ messages: changesControl, user });
  } catch (error) {
    // validation error from mongo
    if (error.name === "ValidationError")
      return next(new UserError(error.message));

    // duplicate value error from mongo
    if (error.code === 11000)
      return next(
        new UserError(
          "Duplicate value. Body parameters 'username', 'email', 'phone' must be unique."
        )
      );

    next(error);
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
