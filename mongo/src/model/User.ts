import { Schema, model } from "mongoose";
import type { UserType } from "../types/user";

const userSchema = new Schema<UserType>(
  {
    googleId: { type: String, unique: true, sparse: true },

    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },

    phoneNumber: { type: String, required: false },
    password: { type: String, required: false },

    profileImage: {
      url: { type: String, default: "" },
      publicId: { type: String, default: "" },
    },

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
