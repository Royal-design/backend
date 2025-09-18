// Success response helper
export const sendSuccess = (
  res,
  data = {},
  message = "Success",
  status = 200
) => {
  return res.status(status).json({
    status: "success",
    message,
    data,
  });
};

// Error response helper
export const sendError = (
  res,
  message = "Something went wrong",
  status = 500,
  errors = null
) => {
  return res.status(status).json({
    status: "error",
    message,
    errors,
  });
};
