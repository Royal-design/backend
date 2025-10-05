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
import { errorHandler } from "./middleware/errorHandler";
import session from "express-session";
import passport from "./config/passport";

const PORT = process.env.PORT || 8000;
connectDb();

const app = express();

app.use(cors(corsOption));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret_key",
    resave: true,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// routes
app.use("/register", register);
app.use("/auth", auth);
app.use("/refresh", refresh);
app.use("/logout", logout);

// Google OAuth route
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google OAuth callback
app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    // If authentication succeeded
    res.redirect("/profile"); // or generate a JWT here and send it to frontend
  }
);

app.use(verifyJwt);

// verified route
app.use("/users", users);
app.use("/users", users);
app.use("/roles", roles);

app.use(errorHandler);
mongoose.connection.once("open", () => {
  console.log("Connected to MongoDb");
  app.listen(PORT, () =>
    console.log(`Server running on http://localhost:${PORT}`)
  );
});
