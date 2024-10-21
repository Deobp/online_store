import { User } from "../models/userModel.js";

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