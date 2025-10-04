import { Document } from "mongoose";

export type Role = "admin" | "user" | "moderator";
export interface UserType extends Document {
  name: string;
  email: string;
  phoneNumber: string;
  password: string;
  refreshToken?: string;
  createdAt: Date;
  roles: Role[];
  updatedAt: Date;
}
