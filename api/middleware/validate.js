export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    const formattedErrors = (result.error?.issues || []).map((err) => ({
      field: err.path.join(".") || "(root)",
      message: err.message,
    }));

    return res.status(400).json({
      status: "error",
      errors: formattedErrors.length
        ? formattedErrors
        : [{ message: "Invalid request" }],
    });
  }

  // Replace req.body with validated & stripped data
  req.body = result.data;
  next();
};
