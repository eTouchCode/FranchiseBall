import { Request, Response } from "express";
import { loginUser, registerUser } from "../services/authService";
import { validateLoginInput, validateRegisterInput } from "../validators/authValidator";

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { error } = validateRegisterInput(req.body);
    if (error) {
      res.status(400).json({ message: error.details[0].message });
      return;
    }

    const { username, email, password } = req.body;

    const user = await registerUser(username, email, password);

    res.status(201).json({
      message: "User registered successfully!",
      user: {
        username: user.username,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    if (err instanceof Error) {
      res.status(400).json({ message: err.message });
    } else {
      console.error(err);
      res.status(500).json({ message: "Server error. Please try again." });
    }
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { error } = validateLoginInput(req.body);
    if (error) {
      res.status(400).json({ message: error.details[0].message });
      return;
    }

    const { email, password } = req.body;
    const { token, user } = await loginUser(email, password);

    res.status(200).json({
      message: 'Login successful!',
      token: token,
      user: user
    });
  } catch (err) {
    if (err instanceof Error) {
      res.status(400).json({ message: err.message });
    } else {
      console.error(err);
      res.status(500).json({ message: "Server error. Please try again." });
    }
  }
}