const express = require("express");
const path = require("path");
const cors = require("cors");
const { logger } = require("./middleware/logEvents");
const errorHandler = require("./middleware/errorhandler");

const app = express();
const PORT = 8000;

// custom middleware logger
app.use(logger);

// Cross-Origin Resource Sharing
const whiteLists = ["https://www.yoursite.com", "http://localhost:8000"];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like Postman, curl, mobile apps)
    if (!origin) return callback(null, true);

    if (whiteLists.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Built-in middleware
app.use(express.urlencoded({ extended: false })); // form data
app.use(express.json()); // JSON
app.use(express.static(path.join(__dirname, "public"))); // static files

// Routes
app.get("/about", (req, res) => {
  res.send("This is about page");
});

app.get(/^\/index(.html)?$/, (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

app.get(/^\/ab?cd$/, (req, res) => {
  res.send("This is route acd or abcd");
});

app.get(/^\/ab+cd$/, (req, res) => {
  res.send("This abcd or abbcd");
});

app.get(/^\/ab.*cd$/, (req, res) => {
  res.send("This abcd or abRANDOMcd or abccd");
});

// Redirects
app.get(/^\/new-page(.html)?$/, (req, res) => {
  res.sendFile(path.join(__dirname, "views", "new-page.html"));
});

app.get("/old-page", (req, res) => {
  res.redirect(301, "/new-page.html");
});

// Route handler with next()
app.get(
  "/hello",
  (req, res, next) => {
    console.log("Hello world!");
    next();
  },
  (req, res) => {
    res.send("Hello welcome");
  }
);

// Chaining route handlers
const one = (req, res, next) => {
  console.log("one");
  next();
};
const two = (req, res, next) => {
  console.log("two");
  next();
};
const three = (req, res) => {
  res.send("finished");
};
app.get("/chain", [one, two, three]);

// 404 handler (must come after all routes)
app.use((req, res) => {
  if (req.accepts("html")) {
    res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ error: "404 Not Found" });
  } else {
    res.type("txt").send("404 Not Found");
  }
});

// Error handler (must come last)
app.use(errorHandler);

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
