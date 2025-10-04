import { Document, model, Schema } from "mongoose";
import type { Role as RoleType } from "../types/user";

export interface RoleProps extends Document {
  role: RoleType;
  createdAt: Date;
  updatedAt: Date;
}

const roleSchema = new Schema<RoleProps>(
  {
    role: {
      type: String,
      required: true,
      unique: true,
      enum: ["admin", "user", "moderator"],
    },
  },
  { timestamps: true }
);

export const Role = model<RoleProps>("Role", roleSchema);
