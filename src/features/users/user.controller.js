import User from "./user.model.js";
import Post from "../post/post.model.js";

const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      include: [{ model: Post, as: "posts" }],
    });

    return res.status(200).json({
      message: "Users fetched successfully.",
      users,
      data: { users },
    });
  } catch (error) {
    console.error("Get All Users Error:", error);
    return res.status(500).json({ message: "Failed to fetch users.", error: error.message });
  }
};

const createUser = async (req, res) => {
  try {
    const { name, email, age } = req.body;
    if (!name || !email || !age) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const user = await User.create({ name, email, age });
    if (!user) {
      return res.status(500).json({ message: "User creation failed." });
    }

    return res.status(201).json({
      message: "User created successfully.",
      user,
      data: { user },
    });
  } catch (error) {
    console.error("Create User Error:", error);
    return res.status(500).json({ message: "Failed to create user.", error: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id, {
      include: [{ model: Post, as: "posts" }],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    return res.status(200).json({ message: "User fetched successfully.", user, data: { user } });
  } catch (error) {
    console.error("Get User Error:", error);
    return res.status(500).json({ message: "Unable to fetch user.", error: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, age } = req.body;

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    await user.update({ name, email, age });

    return res.status(200).json({ message: "User updated successfully.", user, data: { user } });
  } catch (error) {
    console.error("Update User Error:", error);
    return res.status(500).json({ message: "Unable to update user.", error: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedRows = await User.destroy({ where: { id } });

    if (!deletedRows) {
      return res.status(404).json({ message: "User not found." });
    }

    return res.status(200).json({ message: "User deleted successfully.", data: { id } });
  } catch (error) {
    console.error("Delete User Error:", error);
    return res.status(500).json({ message: "Unable to delete user.", error: error.message });
  }
};

export { createUser, getAllUsers, getUserById, updateUser, deleteUser };
