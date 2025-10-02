import { Document } from "mongoose";

export interface UserType extends Document {
  name: string;
  email: string;
  phoneNumber: string;
  password: string;
  refreshToken?: string;
  createdAt: Date;
  updatedAt: Date;
}
