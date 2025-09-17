import products from "../data/products.js";

const getAllProducts = (req, res) => {
  res.json(products);
};

const createProduct = (req, res) => {
  res.send("create product");
};

const updateProduct = (req, res) => {
  res.send(`update product ${req.params.id}`);
};

const deleteProduct = (req, res) => {
  res.send(`delete product ${req.params.id}`);
};

export { getAllProducts, createProduct, updateProduct, deleteProduct };
