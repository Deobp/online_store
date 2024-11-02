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

    /*if (req.user.id !== id) {
      if (req.user.role !== "admin")
        return res.status(401).json({
          message: "Access denied, you are not admin or this is not your data.",
        });
    }*/

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

    /*if (req.user.id !== id) {
      if (req.user.role !== "admin")
        return next(new UserError("Access denied.", 401));
    }*/

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

    /*if (req.user.id !== id) {
      if (req.user.role !== "admin")
        return next(new UserError("Access denied.", 403));
    }*/

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
export const deleteUser = async (req, res, next) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);

    if (!deletedUser) return next(new UserError("User not found.", 404));

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

// adding to cart
export const addToCart = async (req, res, next) => {
  const { id } = req.params;

  /*if (req.user.id !== id) {
    if (req.user.role !== "admin")
      return next(new UserError("Access denied.", 403));
  }*/

  const { productId, quantity } = req.body;
  try {
    const product = await Product.findById(productId);

    if (!product)
      return next(new UserError("Product with this id not found.", 404));

    if (product.isEnded) return next(new UserError("Out of stock."));

    if (quantity > product.quantity)
      return next(new UserError("Not enough products in stock."));

    const user = await User.findById(id);

    if (!user) return next(new UserError("User with this id not found.", 404));

    await user.addToCart(productId, quantity, product.quantity);

    res.status(200).json({ message: "Product added to cart", cart: user.cart });
  } catch (error) {
    next(error);
  }
};

// clearing cart
export async function clearCart(req, res, next) {
  const { id } = req.params;

  //if (id === "me") id = req.user.id;

  /*if (req.user.id !== id) {
    if (req.user.role !== "admin")
      return next(new UserError("Access denied.", 403));
  }*/

  try {
    const user = await User.findById(id);

    if (!user) return next(new UserError("User with this id not found.", 404));

    await user.clearCart();

    res
      .status(200)
      .json({ message: "User's cart is cleared.", cart: user.cart });
  } catch (error) {
    next(error);
  }
}

// viewing cart of one user
export async function viewCart(req, res, next) {
  const { id } = req.params;

  //if (id === "me") id = req.user.id;

  /*if (req.user.id !== id) {
    if (req.user.role !== "admin")
      return next(new UserError("Access denied.", 403));
  }*/

  try {
    const user = await User.findById(id);

    if (!user) return next(new UserError("User with this id not found.", 404));

    const result = await user.getCart();

    res.status(200).json({ cart: result });
  } catch (error) {
    next(error);
  }
}

// login
export async function verifyUser(req, res, next) {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user || !bcrypt.compareSync(req.body.password, user.password)) {
      return next(new UserError("Invalid credentials.", 401));
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
  } catch (error) {
    next(error);
  }
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

  try {
    let user = await User.findOne({ username });
    if (user) return next(new UserError("This username is busy."));

    user = await User.findOne({ email });
    if (user) return next(new UserError("This email is busy."));

    user = await User.findOne({ phone });
    if (user) return next(new UserError("This email is busy."));

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
}

// logout
export async function logout(req, res, next) {
  try {
    // clear cookie with token
    res.clearCookie("token", {
      httpOnly: true,
    });

    return res.status(200).json({ message: "Logout: success." });
  } catch (error) {
    next(error);
  }
}

// Getting list of orders from 1 user
export async function getOrdersByUserId(req, res, next) {
  try {
    const user = await User.findById(req.params.id).populate("orders");

    res.json(user.orders);
  } catch (error) {
    next(error);
  }
}
