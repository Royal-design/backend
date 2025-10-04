import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import mongoose from "mongoose";
import { connectDb } from "./config/dbConnection";
import { corsOption } from "./config/corsOptions";
import register from "./routes/register";
import auth from "./routes/auth";
import users from "./routes/users";
import refresh from "./routes/refresh";
import logout from "./routes/logout";
import roles from "./routes/roles";

import { verifyJwt } from "./middleware/verifyJwt";

const PORT = process.env.PORT || 8000;
connectDb();

const app = express();

app.use(cors(corsOption));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// routes
app.use("/register", register);
app.use("/auth", auth);
app.use("/refresh", refresh);
app.use("/logout", logout);

app.use(verifyJwt);

// verified route
app.use("/users", users);
app.use("/users", users);
app.use("/roles", roles);

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDb");
  app.listen(PORT, () =>
    console.log(`Server running on http://localhost:${PORT}`)
  );
});
