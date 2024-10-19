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
    try {
      const { firstName, lastName, username, password, phone, email, country, city, street, house, apartment } = req.body;
      const newUser = new User({ firstName, lastName, username, password, phone, email, country, city, street, house, apartment });
      const savedUser = await newUser.save();
      res.status(201).json(savedUser);
  } catch (error) {
      res.status(400).json({ message: error.message });
  }
};