import products from "../data/products.js";
import { sendError, sendSuccess } from "../helper/response.js";

// const getAllProducts = (req, res) => {
//   // pull query params as strings
//   let { search = "", pageSize = "10", page = "1" } = req.query;

//   // convert them into numbers
//   pageSize = +pageSize;
//   page = +page;

//   // sanitize: prevent invalid values
//   if (isNaN(pageSize) || pageSize <= 0) pageSize = 10;
//   if (isNaN(page) || page <= 0) page = 1;

//   // filter by search
//   const filteredProducts = products.filter(
//     (product) =>
//       product.name.toLowerCase().includes(search.toLowerCase()) ||
//       product.category.toLowerCase().includes(search.toLowerCase())
//   );

//   // pagination
//   const startIndex = (page - 1) * pageSize;
//   const endIndex = page * pageSize;
//   const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

//   // respond with metadata
//   return sendSuccess(
//     res,
//     {
//       products: paginatedProducts,
//       total: filteredProducts.length,
//       page,
//       pageSize,
//       totalPages: Math.ceil(filteredProducts.length / pageSize),
//     },
//     "Products retrieved successfully",
//     200
//   );
// };

// const createProduct = (req, res) => {
//   const allowedKeys = ["name", "price", "category", "inStock"];
//   const bodyKeys = Object.keys(req.body);

//   if (Object.keys(req.body).length === 0) {
//     return sendError(res, "Request body is empty", 400);
//   }

//   for (const key of allowedKeys) {
//     if (!(key in req.body))
//       return sendError(res, `Missing required field: ${key}`, 400);
//   }

//   for (const key of bodyKeys) {
//     if (!allowedKeys.includes(key))
//       return sendError(res, `Invalid field provided: ${key}`, 400);
//   }

//   const newProducts = { id: products.length + 1, ...req.body };
//   products.push(newProducts);

//   return sendSuccess(res, newProducts, "Product created successfully!", 201);
// };

// const updateProduct = (req, res) => {
//   const productId = req.params.id;
//   const product = products.find((product) => product.id === +productId);
//   const allowedKeys = ["name", "price", "category", "inStock"];
//   const bodyKeys = Object.keys(req.body);

//   for (const key of allowedKeys) {
//     if (!(key in req.body))
//       return sendError(res, `Missing required field: ${key}`, 400);
//   }

//   for (const key of bodyKeys) {
//     if (!allowedKeys.includes(key))
//       return sendError(res, `Invalid field provided: ${key}`, 400);
//   }

//   if (!product) return sendError(res, `Product not found`, 404);

//   allowedKeys.forEach((key) => {
//     product[key] = req.body[key];
//   });

//   return sendSuccess(res, product, "Product updated successfully", 200);
// };

// const deleteProduct = (req, res) => {
//   const productId = req.params.id;
//   const index = products.findIndex((product) => product.id === +productId);
//   if (index === -1) return sendError(res, `Product not found`, 404);
//   const deletedProduct = products.splice(index, 1)[0];

//   return sendSuccess(
//     res,
//     deletedProduct,
//     `Product with id ${productId} deleted successfully`,
//     200
//   );
// };

// const getProductById = (req, res) => {
//   const productId = parseInt(req.params.id);
//   const product = products.find((product) => product.id === productId);
//   if (!product) return sendError(res, `Product ${productId} not found`, 404);

//   return sendSuccess(res, product, "Product retrieved successfully", 200);
// };

// export {
//   getAllProducts,
//   createProduct,
//   updateProduct,
//   deleteProduct,
//   getProductById,
// };

// using  middleware

const getAllProducts = (req, res) => {
  let { search = "", pageSize = "10", page = "1" } = req.query;

  pageSize = Number(pageSize);
  page = Number(page);

  if (isNaN(pageSize) || pageSize <= 0) pageSize = 10;
  if (isNaN(page) || page <= 0) page = 1;

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.category.toLowerCase().includes(search.toLowerCase())
  );

  const startIndex = (page - 1) * pageSize;
  const paginatedProducts = filteredProducts.slice(
    startIndex,
    startIndex + pageSize
  );

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

// CREATE product (body is validated by Zod middleware)
const createProduct = (req, res) => {
  const newProduct = { id: products.length + 1, ...req.body };
  products.push(newProduct);

  return sendSuccess(res, newProduct, "Product created successfully!", 201);
};

// UPDATE product by id (body validated by Zod)
const updateProduct = (req, res) => {
  const productId = Number(req.params.id);
  const product = products.find((p) => p.id === productId);

  if (!product) return sendError(res, "Product not found", 404);

  // update only allowed fields (req.body already validated)
  Object.assign(product, req.body);

  return sendSuccess(res, product, "Product updated successfully", 200);
};

// DELETE product by id
const deleteProduct = (req, res) => {
  const productId = Number(req.params.id);
  const index = products.findIndex((p) => p.id === productId);

  if (index === -1) return sendError(res, "Product not found", 404);

  const deletedProduct = products.splice(index, 1)[0];
  return sendSuccess(
    res,
    deletedProduct,
    `Product with id ${productId} deleted successfully`,
    200
  );
};

// GET single product by id
const getProductById = (req, res) => {
  const productId = Number(req.params.id);
  const product = products.find((p) => p.id === productId);

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
