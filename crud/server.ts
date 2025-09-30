import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { corsOptions } from "./config/corsOption";
import register from "./routes/register";
import auth from "./routes/auth";
import users from "./routes/users";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/register", register);
app.use("/auth", auth);
app.use("/users", users);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
