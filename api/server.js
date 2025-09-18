import express from "express";
import students from "./routes/students.js";
import teachers from "./routes/teachers.js";
import products from "./routes/products.js";

const PORT = 8000;
const app = express();
app.use(express.json());

app.use("/students", students);
app.use("/teachers", teachers);
app.use("/products", products);

app.param("id", (req, res, next, value, name) => {
  console.log(`Param ${name} = ${value}`);
  next();
});

app.get("/users/:id", (req, res) => {
  console.log("this is user id path");
  res.send(`Response ok, user id: ${req.params.id}`);
});

app.post("/users", (req, res) => {
  const { name, age } = req.body;
  if (!name || !age) {
    res.status(401).json({ message: "incomplete data" });
  }
  res
    .status(201)
    .json({ message: "User created successfully!", data: { name, age } });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
