import { allowedOrigins } from "./allowedOrigins.js";

export const corsOptions = {
  origin: (origin, callback) => {
    // allow requests with no origin (like mobile apps, curl, Postman)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true, // allow cookies, Authorization headers, etc.
  optionsSuccessStatus: 200, // some legacy browsers choke on 204
};
