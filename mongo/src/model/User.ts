import { Schema, model } from "mongoose";
import type { UserType } from "../types/user";

const userSchema = new Schema<UserType>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true },
    password: { type: String, required: true },
    roles: {
      type: [String],
      required: true,
      enum: ["admin", "user", "moderator"],
      default: ["user"],
    },
    refreshToken: String,
  },
  { timestamps: true }
);

export const User = model<UserType>("User", userSchema);
