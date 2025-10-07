import { Document } from "mongoose";

export type Role = "admin" | "user" | "moderator";
export interface UserType extends Document {
  googleId?: string;
  githubId?: string;
  name: string;
  email: string;
  phoneNumber?: string;
  password?: string;
  refreshToken?: string;
  profileImage: { url: string; publicId: string };
  createdAt: Date;
  roles: Role[];
  updatedAt: Date;
}
