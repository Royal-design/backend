import express from "express";
import students from "./routes/students.js";
import teachers from "./routes/teachers.js";
import products from "./routes/products.js";

const PORT = 8000;
const app = express();

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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
