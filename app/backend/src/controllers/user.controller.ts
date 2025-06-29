import { Request, Response } from "express";
import User from "../models/user.model";

/**
 * @desc    Get all users
 * @route   GET /api/users
 * @access  Protected
 */
export const searchUsers = async (req: Request, res: Response) => {
  try {
    // Find all users, excluding the currently logged-in user from the results.
    const users = await User.find({ _id: { $ne: req.user?._id } }).select(
      "-password"
    ); // Don't include the password in the response

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server Error: Could not fetch users" });
  }
};
