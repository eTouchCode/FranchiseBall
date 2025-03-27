import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';

import User, { IUser } from '../models/User';

export const registerUser = async (
  username: string,
  team_name: string,
  password: string
): Promise<IUser> => {
  const existingUser = await User.findOne({ $or: [{ team_name }, { username }] });
  if (existingUser) {
    throw new Error("User with this team name or username already exists.");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);;

  const newUser = new User({
    username,
    team_name,
    password: hashedPassword,
  });
  return await newUser.save();
}

export const loginUser = async (team_name: string, password: string) => {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new Error("JWT_SECRET is not defined");
  }

  const user = await User.findOne({ team_name });
  if (!user) {
    throw new Error("Team Name is not correct.");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Password is not correct.")
  }

  const token = jwt.sign(
    { userId: user._id, username: user.username, team_name: user.team_name },
    jwtSecret,
    { expiresIn: '1h' }
  );

  return {
    token, user: {
      username: user?.username,
      team_name: user?.team_name
    }
  };
}