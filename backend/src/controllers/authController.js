import bcryptjs from "bcryptjs";
import validator from 'validator';
import { User } from "../models/User.js";
import { responseHandler } from "../helpers/responseHandler.js";
import { generateTokenAndSetCookie } from "../helpers/generateTokenAndSetCookie.js";
import { sanitizeUser } from "../helpers/sanitizeUser.js";

export const register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Validate that all required fields are provided
    if (!name || !email || !password) {
      return responseHandler(res, {
        status: 400,
        success: false,
        message: "All fields are required"
      });
    }

    // Validate email format
    if (!validator.isEmail(email)) {
      return responseHandler(res, {
        status: 400,
        success: false,
        message: "Please provide the correct email format",
        error: "Invalid email format"
      });
    }

    // Validate password complexity
    const passwordErrors = validatePasswordComplexity(password);
    if (passwordErrors.length > 0) {
      return responseHandler(res, {
        status: 400,
        success: false,
        message: 'Password does not meet requirements',
        errors: passwordErrors,
      });
    }

    // Check if a user with the given email already exists
    const user = await User.findOne({ email });
    if (user) {
      return responseHandler(res, {
        status: 400,
        success: false,
        message: "User already exists",
      });
    }

    // Hash the password
    const hashedPassword = await bcryptjs.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });
    await newUser.save();

    // Generate a JWT token and set it as a cookie in the response
    generateTokenAndSetCookie(res, user._id);

    return responseHandler(res, {
      status: 201,
      success: true,
      message: "User created successfully",
      data: sanitizeUser(user),
    });
  } catch (error) {
    return responseHandler(res, {
      status: 400,
      success: false,
      message: "An error occurred while creating your account",
      error: error.message,
    });
  }
}