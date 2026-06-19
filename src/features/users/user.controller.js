import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "./user.model.js";
import Post from "../post/post.model.js";

const jwtSecret = process.env.JWT_SECRET || "default_jwt_secret";
const jwtExpiry = "1h";

const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      include: [
        {
          model: Post,
          as: "posts",
        },
      ],
    });

    return res.status(200).json({
      message: "Users fetched successfully.",
      users,
      data: { users },
    });
  } catch (error) {
    console.error("Get All Users Error:", error);
    return res.status(500).json({
      message: "Failed to fetch users.",
      error: error.message,
    });
  }
};

const registerUser = async (req, res) => {
  try {
    const { name, email, age, password } = req.body;

    if (!name || !email || !age || !password) {
      return res
        .status(400)
        .json({ message: "Name, email, age, and password are required." });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: "Email is already registered." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      age,
      password: hashedPassword,
    });

    const token = jwt.sign({ id: user.id, email: user.email }, jwtSecret, {
      expiresIn: jwtExpiry,
    });

    return res.status(201).json({
      message: "User registered successfully.",
      user,
      token,
      data: { user },
    });
  } catch (error) {
    console.error("Register User Error:", error);
    return res.status(500).json({
      message: "Failed to register user.",
      error: error.message,
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }

    const user = await User.findOne({
      where: { email },
      attributes: ["id", "name", "email", "age", "password"],
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, jwtSecret, {
      expiresIn: jwtExpiry,
    });

    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      age: user.age,
    };

    return res.status(200).json({
      message: "Login successful.",
      user: safeUser,
      token,
      data: { user: safeUser },
    });
  } catch (error) {
    console.error("Login User Error:", error);
    return res.status(500).json({
      message: "Failed to login.",
      error: error.message,
    });
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id, {
      include: [
        {
          model: Post,
          as: "posts",
        },
      ],
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    return res.status(200).json({
      message: "User fetched successfully.",
      user,
      data: { user },
    });
  } catch (error) {
    console.error("Get User Error:", error);
    return res.status(500).json({
      message: "Unable to fetch user.",
      error: error.message,
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, age, password } = req.body;

    const user = await User.findByPk(id, {
      attributes: ["id", "name", "email", "age", "password"],
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    const updateData = { name, email, age };
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    await user.update(updateData);

    const updatedUser = await User.findByPk(id);

    return res.status(200).json({
      message: "User updated successfully.",
      user: updatedUser,
      data: { user: updatedUser },
    });
  } catch (error) {
    console.error("Update User Error:", error);
    return res.status(500).json({
      message: "Unable to update user.",
      error: error.message,
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedRows = await User.destroy({
      where: { id },
    });

    if (!deletedRows) {
      return res.status(404).json({
        message: "User not found.",
      });
    }
    return res.status(200).json({
      message: "User deleted successfully.",
      data: { id },
    });
  } catch (error) {
    console.error("Delete User Error:", error);
    return res.status(500).json({
      message: "Unable to delete user.",
      error: error.message,
    });
  }
};

export {
  registerUser,
  loginUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
