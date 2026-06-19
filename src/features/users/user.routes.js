import express from 'express';
import {
  registerUser,
  loginUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from './user.controller.js';

const router = express.Router();

// Register a new user
router.post('/register', registerUser);


// Login for existing users
router.post('/login', loginUser);

// GET all users
router.get('/', getAllUsers);

// GET user by ID
router.get('/:id', getUserById);

// UPDATE user by ID
router.put('/:id', updateUser);

// DELETE user by ID
router.delete('/:id', deleteUser);

export default router;
