import dotenv from "dotenv";
dotenv.config();

// Then import other stuff
import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import students from "./routes/students.js";
import teachers from "./routes/teachers.js";
import products from "./routes/products.js";
import register from "./routes/register.js";
import auth from "./routes/auth.js";
import users from "./routes/users.js";
import refresh from "./routes/refresh.js";
import logout from "./routes/logout.js";
import { corsOptions } from "./config/corsOptions.js";
import { verifyRoles } from "./middleware/verifyRoles.js";
import { verifyJWT } from "./middleware/verifyJWT.js";

// Create app
const app = express();

const PORT = 8000;
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());

app.use("/students", students);
app.use("/teachers", teachers);
app.use("/products", products);
app.use("/register", register);
app.use("/auth", auth);
app.use("/users", users);
app.use("/refresh", refresh);
app.use("/logout", logout);

app.get("/read-cookie", (req, res) => {
  const token = req.cookies.jwt; // 👈 read cookie named "jwt"
  res.send({ token });
});

app.get("/admin", verifyJWT, verifyRoles("Admin"), (req, res) => {
  res.send("Welcome, Admin!");
});

app.get("/editor", verifyJWT, verifyRoles("Editor", "Admin"), (req, res) => {
  res.send("Welcome, Editor!");
});

// app.param("id", (req, res, next, value, name) => {
//   console.log(`Param ${name} = ${value}`);
//   next();
// });

// app.get("/users/:id", (req, res) => {
//   console.log("this is user id path");
//   res.send(`Response ok, user id: ${req.params.id}`);
// });

// app.post("/users", (req, res) => {
//   const { name, age } = req.body;
//   if (!name || !age) {
//     res.status(401).json({ message: "incomplete data" });
//   }
//   res
//     .status(201)
//     .json({ message: "User created successfully!", data: { name, age } });
// });

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
