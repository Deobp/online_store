import Product from "../models/Product.js";
import User from "../models/User.js";
import jwt from "../utils/jwt.js"
import bcrypt from "bcrypt"

export const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    if(!users.length) return res.status(200).json({ message: "no users in db" });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params
    
    if(req.user.id !== id) {
      if(req.user.role !== "admin")
        return res.status(401).json({ message: "Access denied, you are not admin or this is not your data."})
      } 
    
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createUser = async (req, res) => {
  const {
    firstName,
    lastName,
    username,
    password,
    phone,
    email,
    country,
    city,
    street,
    house,
    apartment,
  } = req.body;

  try {
    const user = new User({
      firstName,
      lastName,
      username,
      password,
      phone,
      email,
      country,
      city,
      street,
      house,
      apartment,
    });

    const savedUser = await user.save();

    res.status(201).json(savedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params
    
    if(req.user.id !== id) {
      if(req.user.role !== "admin")
        return res.status(401).json({ message: "Access denied, you are not admin or this is not your data."})
      } 

    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
      if (!updatedUser) return res.status(404).json({ message: "User not found" });
      res.status(200).json(updatedUser);
    
  } catch (error) {
    if (error.name === "ValidationError" || error.code === 11000)
      return res.status(400).json({ message: error.message })
    
    res.status(500).json({ message: error.message });
  }
}

export const deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ message: "User not found" });
    res.status(200).json({message: 'User deleted successfully', deletedUser: deletedUser});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export const addToCart = async (req,res) => {
  const { id } = req.params
    
    if(req.user.id !== id) {
      if(req.user.role !== "admin")
        return res.status(403).json({ message: "Access denied, you are not admin or this is not your data."})
    }
    
    const {productId, quantity} = req.body;
    
    if (!productId)
      return res.status(400).json({ message: "Product ID is missing" })

    if (!quantity)
      return res.status(400).json({ message: "Product's quantity is missing" })

    try {
      const product = await Product.findById(productId)
    
      if (!product)
          return res.status(404).json({ message: "Product with this id not found" })

      if(parseInt(quantity) > product.quantity)
          return res.status(400).json({ message: "Not enough products in stock." })

      const user = await User.findById(id);
      
      if (!user) return res.status(404).json({ message: "User with this ID not found" });
        
      await user.addToCart(productId, quantity, product.quantity);
    
      res.status(200).json({message: "Product added to cart", cart: user.cart});
  } catch (error) {
    if (error.name === "CastError" || error.name === "StockError")
      return res.status(400).json({ message: error.message })

    res.status(500).json({ message: error.message });
  }
}

export async function clearCart(req, res) {
  const { id } = req.params
    
  if(req.user.id !== id) {
    if(req.user.role !== "admin")
      return res.status(403).json({ message: "Access denied, you are not admin or this is not your data."})
    }

    const user = await User.findById(id);
      
    if (!user) return res.status(404).json({ message: "User with this ID not found" });

    await user.clearCart()

    res.status(200).json({message: "User's cart is cleared.", cart: user.cart});
  
}

export async function viewCart(req, res) {
  const { id } = req.params
    
  if(req.user.id !== id) {
    if(req.user.role !== "admin")
      return res.status(403).json({ message: "Access denied, you are not admin or this is not your data."})
    }

    const user = await User.findById(id);
      
    if (!user) return res.status(404).json({ message: "User with this ID not found" });

    const result = await user.getCart()

    res.status(200).json({cart: result});
  
}

export const updatePassword = async (req, res) => {
  try {
    const { id } = req.params
    
    if(req.user.id !== id) {
      if(req.user.role !== "admin")
        return res.status(403).json({ message: "Access denied, you are not admin or this is not your data."})
    }

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const {password} = req.body;

    if (!password)
      return res.status(400).json({ message: "Password is missing" })

    if(bcrypt.compareSync(password, user.password)) 
      return res.status(400).json({message: "Password didn't change. You already use it."});

    await user.updatePassword(password);
    res.status(200).json({message: "Password updated successfully"});
  } catch (error) {
    if (error.name === "ValidationError" || error.message.includes("Invalid value"))
      return res.status(400).json({ message: error.message })
    res.status(500).json({ message: error.message });
  }
}

export const updateFirstName = async (req, res) => {
  try {
    const { id } = req.params
    
    if(req.user.id !== id) {
      if(req.user.role !== "admin")
        return res.status(403).json({ message: "Access denied, you are not admin or this is not your data."})
    }

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const {firstName} = req.body;
    
    if (!firstName)
      return res.status(400).json({ message: "First name is missing" })
    
    const result = await user.updateFirstName(firstName);
    res.status(200).json({message: "First name updated successfully", result});
  } catch (error) {
      if (error.message.includes("didn't change") || error.name === "ValidationError" || error.code === 11000)
        return res.status(400).json({ message: error.message })
      res.status(500).json({ message: error.message });
  }
}

export const updateLastName = async (req, res) => {
  try {
    const { id } = req.params
    
    if(req.user.id !== id) {
      if(req.user.role !== "admin")
        return res.status(403).json({ message: "Access denied, you are not admin or this is not your data."})
    }  
    
    const user = await User.findById(req.params.id);
      if (!user) return res.status(404).json({ message: "User not found" });
      
      const { lastName } = req.body;

      if (!lastName)
        return res.status(400).json({ message: "Last name is missing" })

      const result = await user.updateLastName(lastName);
      res.status(200).json({message: "Last name updated successfully", result});
    } catch (error) {
      if (error.message.includes("didn't change") || error.name === "ValidationError" || error.code === 11000)
        return res.status(400).json({ message: error.message })
      res.status(500).json({ message: error.message });
  }
};

export const updateUsername = async (req, res) => {
  try {
    const { id } = req.params
    
    if(req.user.id !== id) {
      if(req.user.role !== "admin")
        return res.status(403).json({ message: "Access denied, you are not admin or this is not your data."})
    }  
    
    const user = await User.findById(req.params.id);
      if (!user) return res.status(404).json({ message: "User not found" });
      
      const { username } = req.body;

      if (!username)
        return res.status(400).json({ message: "Username is missing" })

      const result = await user.updateUsername(username);
      res.status(200).json({message: "Username updated successfully", result});
    } catch (error) {
      if (error.message.includes("didn't change") || error.name === "ValidationError" || error.code === 11000)
        return res.status(400).json({ message: error.message })
      res.status(500).json({ message: error.message });
  }
};

export const updatePhone = async (req, res) => {
  try {
    const { id } = req.params
    
    if(req.user.id !== id) {
      if(req.user.role !== "admin")
        return res.status(403).json({ message: "Access denied, you are not admin or this is not your data."})
    }  
    
    const user = await User.findById(req.params.id);
      if (!user) return res.status(404).json({ message: "User not found" });
      
      const { phone } = req.body;

      if (!phone)
        return res.status(400).json({ message: "Phone number is missing" })

      const result = await user.updatePhone(phone);
      res.status(200).json({message: "Phone number updated successfully", result});
    } catch (error) {
      if (error.message.includes("didn't change") || error.name === "ValidationError" || error.code === 11000)
        return res.status(400).json({ message: error.message })
      res.status(500).json({ message: error.message });
  }
};

export const updateEmail = async (req, res) => {
  try {
    const { id } = req.params
    
    if(req.user.id !== id) {
      if(req.user.role !== "admin")
        return res.status(403).json({ message: "Access denied, you are not admin or this is not your data."})
    }  
    
    const user = await User.findById(req.params.id);
      if (!user) return res.status(404).json({ message: "User not found" });
      
      const { email } = req.body;

      if (!email)
        return res.status(400).json({ message: "email is missing" })

      const result = await user.updateEmail(email);
      res.status(200).json({message: "email updated successfully", result});
    } catch (error) {
      if (error.message.includes("didn't change") || error.name === "ValidationError" || error.code === 11000)
        return res.status(400).json({ message: error.message })
      res.status(500).json({ message: error.message });
  }
};

export const updateCountry = async (req, res) => {
  try {
    const { id } = req.params
    
    if(req.user.id !== id) {
      if(req.user.role !== "admin")
        return res.status(403).json({ message: "Access denied, you are not admin or this is not your data."})
    }  
    
    const user = await User.findById(req.params.id);
      if (!user) return res.status(404).json({ message: "User not found" });
      
      const { country } = req.body;

      if (!country)
        return res.status(400).json({ message: "Country is missing" })

      const result = await user.updateCountry(country);
      res.status(200).json({message: "Country updated successfully", result});
    } catch (error) {
      if (error.message.includes("didn't change") || error.name === "ValidationError")
        return res.status(400).json({ message: error.message })
      res.status(500).json({ message: error.message });
  }
};

export const updateCity = async (req, res) => {
  try {
    const { id } = req.params
    
    if(req.user.id !== id) {
      if(req.user.role !== "admin")
        return res.status(403).json({ message: "Access denied, you are not admin or this is not your data."})
    }  
    
    const user = await User.findById(req.params.id);
      if (!user) return res.status(404).json({ message: "User not found" });
      
      const { city } = req.body;

      if (!city)
        return res.status(400).json({ message: "City is missing" })

      const result = await user.updateCity(city);
      res.status(200).json({message: "City updated successfully", result});
    } catch (error) {
      if (error.message.includes("didn't change") || error.name === "ValidationError")
        return res.status(400).json({ message: error.message })
      res.status(500).json({ message: error.message });
  }
};

export const updateStreet = async (req, res) => {
  try {
    const { id } = req.params
    
    if(req.user.id !== id) {
      if(req.user.role !== "admin")
        return res.status(403).json({ message: "Access denied, you are not admin or this is not your data."})
    }  
    
    const user = await User.findById(req.params.id);
      if (!user) return res.status(404).json({ message: "User not found" });
      
      const { street } = req.body;

      if (!street)
        return res.status(400).json({ message: "Street is missing" })

      const result = await user.updateStreet(street);
      res.status(200).json({message: "Street updated successfully", result});
    } catch (error) {
      if (error.message.includes("didn't change") || error.name === "ValidationError")
        return res.status(400).json({ message: error.message })
      res.status(500).json({ message: error.message });
  }
};

export const updateHouse = async (req, res) => {
  try {
    const { id } = req.params
    
    if(req.user.id !== id) {
      if(req.user.role !== "admin")
        return res.status(403).json({ message: "Access denied, you are not admin or this is not your data."})
    }  
    
    const user = await User.findById(req.params.id);
      if (!user) return res.status(404).json({ message: "User not found" });
      
      const { house } = req.body;

      if (!house)
        return res.status(400).json({ message: "House number is missing" })

      const result = await user.updateHouse(house);
      res.status(200).json({message: "House number updated successfully", result});
    } catch (error) {
      if (error.message.includes("didn't change") || error.name === "ValidationError")
        return res.status(400).json({ message: error.message })
      res.status(500).json({ message: error.message });
  }
};

export const updateApartment = async (req, res) => {
  try {
    const { id } = req.params
    
    if(req.user.id !== id) {
      if(req.user.role !== "admin")
        return res.status(403).json({ message: "Access denied, you are not admin or this is not your data."})
    }  
    
    const user = await User.findById(req.params.id);
      if (!user) return res.status(404).json({ message: "User not found" });
      
      const { apartment } = req.body;

      if (!apartment)
        return res.status(400).json({ message: "Apartment number is missing" })

      const result = await user.updateApartment(apartment);
      res.status(200).json({message: "Apartment number updated successfully", result});
    } catch (error) {
      if (error.message.includes("didn't change") || error.name === "ValidationError")
        return res.status(400).json({ message: error.message })
      res.status(500).json({ message: error.message });
  }
};


export async function verifyUser(req, res, next) {
  const user = await User.findOne({ username: req.body.username })
  if (!user || !bcrypt.compareSync(req.body.password, user.password)) {
    return res.status(401).json({ message: "Invalid credentials."})
  }

  const token = jwt.createToken(user)
  if(!token) return res.status(500).json({ message: "Error generating token"})
  //res.json({ token })
  res.cookie('token', token, {
    httpOnly: true,
    maxAge: 3600000 // 1h
});

res.status(200).json({ message: "User authorized", token });
}

export async function registerUser(req, res, next) {
  const {firstName, lastName, username, password, email, phone, country, city, street, house, apartment} = req.body

  if(!firstName) return res.status(400).json({ message: "First name is missing."})
  
  if(!lastName) return res.status(400).json({ message: "Last name is missing."})
  
  if(!username) return res.status(400).json({ message: "Username is missing."})

  if(!password) return res.status(400).json({ message: "Password is missing."})
  
  if(!email) return res.status(400).json({ message: "email is missing."})
      
  if(!phone) return res.status(400).json({ message: "Phone number is missing."})

  if(!country) return res.status(400).json({ message: "Country is missing."})

  if(!city) return res.status(400).json({ message: "City is missing."})

  if(!street) return res.status(400).json({ message: "Street is missing."})

  if(!house) return res.status(400).json({ message: "House is missing."})
    
  let user = await User.findOne({ username })
  if (user) return res.status(400).json({ message: "This username is busy."})
  
  user = await User.findOne({ email })
  if (user) return res.status(400).json({ message: "This email is busy."})

  user = await User.findOne({ phone })
  if (user) return res.status(400).json({ message: "This phone number is busy."})

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
      apartment        
    });

    await newUser.save()

    const token = jwt.createToken(newUser)
    if(!token) return res.status(500).json({ message: "Error generating token"})
      //res.json({ token })
      res.cookie('token', token, {
        httpOnly: true,
        maxAge: 3600000 // 1h
    });
    res.status(201).json({ message: "User registered successfully", token });

    

  } catch(error) {
    if (error.name === "ValidationError" || error.code === 11000)
      return res.status(400).json({ message: error.message })
    res.status(500).json({ message: error.message })

    }

  
}