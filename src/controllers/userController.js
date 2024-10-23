import User from "../models/User.js";
import jwt from "../utils/jwt.js"

export const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
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
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
      if (!updatedUser) return res.status(404).json({ message: "User not found" });
      res.status(200).json(updatedUser);
    
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

export const deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ message: "User not found" });
    res.status(200).json({message: 'User delete successfully', deletedUser: deletedUser});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export const addToCart = async (req,res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    await user.addToCart(productId, quantity);
    res.status(200).json({message: "Product added to cart", cart: user.cart});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export const updatePassword = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const {newPassword} = req.body;
    await user.updatePassword(newPassword);
    res.status(200).json({message: "Password updated successfully"});
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

export const updateFirstName = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const {newFirstName} = req.body;
    const result = await user.updateFirstName(newFirstName);
    res.status(200).json({message: "First name updated successfully", result});
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

export const updateLastName = async (req, res) => {
  try {
      const user = await User.findById(req.params.id);
      if (!user) return res.status(404).json({ message: "User not found" });
      
      const { newLastName } = req.body;
      const result = await user.updateLastName(newLastName);
      res.status(200).json({message: "Last name updated successfully", result});
    } catch (error) {
      res.status(400).json({ message: error.message });
  }
};

export async function verifyUser(req, res, next) {
  const user = await User.findOne({ username: req.body.username })
  if (!user || !bcrypt.compareSync(req.body.password, user.password)) {
    return res.status(400).json({ message: "Invalid credentials."})
  }

  const token = jwt.createToken(user)
  res.json({ token })
}

export async function registerUser(req, res, next) {
  const {firstName, lastName, username, password, email, phone, country, city, street, house} = req.body

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
      house        
    });

    await newUser.save()

    const token = jwt.createToken(newUser)
    res.status(201).json({ message: "User registered successfully", token });

    

  } catch(error) {
    res.status(500).json({ message: error.message })

    }

  
}