import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

import { corsOptions } from "./config/corsOption";
import register from "./routes/register";
import auth from "./routes/auth";
import users from "./routes/users";
import refresh from "./routes/refresh";
import logout from "./routes/logout";

import cookieParser from "cookie-parser";
import { connectDB } from "./config/dbConn";
import mongoose from "mongoose";
const PORT = process.env.PORT || 8000;

connectDB();

const app = express();

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/register", register);
app.use("/auth", auth);
app.use("/users", users);
app.use("/refresh", refresh);
app.use("/logout", logout);

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
