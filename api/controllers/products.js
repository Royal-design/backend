import products from "../data/products.js";
import { sendError, sendSuccess } from "../helper/response.js";

const getAllProducts = (req, res) => {
  // pull query params as strings
  let { search = "", pageSize = "10", page = "1" } = req.query;

  // convert them into numbers
  pageSize = parseInt(pageSize, 10);
  page = parseInt(page, 10);

  // sanitize: prevent invalid values
  if (isNaN(pageSize) || pageSize <= 0) pageSize = 10;
  if (isNaN(page) || page <= 0) page = 1;

  // filter by search
  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.category.toLowerCase().includes(search.toLowerCase())
  );

  // pagination
  const startIndex = (page - 1) * pageSize;
  const endIndex = page * pageSize;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  // respond with metadata
  return sendSuccess(
    res,
    {
      products: paginatedProducts,
      total: filteredProducts.length,
      page,
      pageSize,
      totalPages: Math.ceil(filteredProducts.length / pageSize),
    },
    "Products retrieved successfully",
    200
  );
};

const createProduct = (req, res) => {
  const allowedKeys = ["name", "price", "category", "inStock"];
  const bodyKeys = Object.keys(req.body);

  if (Object.keys(req.body).length === 0) {
    return sendError(res, "Request body is empty", 400);
  }

  for (const key of allowedKeys) {
    if (!(key in req.body))
      return sendError(res, `Missing required field: ${key}`, 400);
  }

  for (const key of bodyKeys) {
    if (!allowedKeys.includes(key))
      return sendError(res, `Invalid field provided: ${key}`, 400);
  }

  const newProducts = { id: products.length + 1, ...req.body };
  products.push(newProducts);

  return sendSuccess(res, newProducts, "Product created successfully!", 201);
};

const updateProduct = (req, res) => {
  const productId = req.params.id;
  const product = products.find((product) => product.id === +productId);
  const allowedKeys = ["name", "price", "category", "inStock"];
  const bodyKeys = Object.keys(req.body);

  for (const key of allowedKeys) {
    if (!(key in req.body))
      return sendError(res, `Missing required field: ${key}`, 400);
  }

  for (const key of bodyKeys) {
    if (!allowedKeys.includes(key))
      return sendError(res, `Invalid field provided: ${key}`, 400);
  }

  if (!product) return sendError(res, `Product not found`, 404);

  allowedKeys.forEach((key) => {
    product[key] = req.body[key];
  });

  return sendSuccess(res, product, "Product updated successfully", 200);
};

const deleteProduct = (req, res) => {
  const productId = req.params.id;
  const index = products.findIndex((product) => product.id === +productId);
  if (index === -1) return sendError(res, `Product not found`, 404);
  const deletedProduct = products.splice(index, 1)[0];

  return sendSuccess(
    res,
    deletedProduct,
    `Product with id ${productId} deleted successfully`,
    200
  );
};

const getProductById = (req, res) => {
  const productId = parseInt(req.params.id);
  const product = products.find((product) => product.id === productId);
  if (!product) return sendError(res, `Product ${productId} not found`, 404);

  return sendSuccess(res, product, "Product retrieved successfully", 200);
};

export {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductById,
};
