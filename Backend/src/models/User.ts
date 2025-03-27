import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  username: string;
  team_name: string;
  password: string;
  createdAt: Date
}

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true
    },
    team_name: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

const User = mongoose.model<IUser>("User", UserSchema);

export default User;