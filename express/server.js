import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { logger } from "./middleware/logEvents.js";
import cors from "cors";
import { errorHandler } from "./middleware/errorhandler.js";

const app = express();
const PORT = 8000;

// Needed to get __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// custom middleware logger
app.use(logger);

//cross origin resource sharing

const whiteLists = ["https://www.yoursite.com", "http://localhost:8000"];

const corsOptions = {
  origin: (origin, callback) => {
    // allow requests with no origin (like mobile apps, curl, Postman)
    if (!origin) {
      return callback(null, true);
    }
    if (whiteLists.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// content-type:application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));

//built in middleware  for justifyContent:
app.use(express.json());

// serve static file
app.use(express.static(path.join(__dirname, "/public")));

// regex route pattern
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

// redirect

app.get(/^\/new-page(.html)?$/, (req, res) => {
  res.sendFile(path.join(__dirname, "views", "new-page.html"));
});

app.get("/old-page", (req, res) => {
  res.redirect(301, "/new-page.html");
});

//  route handler

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

// chaining route handlers

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
// app.get("/{*splat}", (req, res) => {
//   res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
// });

app.use((req, res) => {
  if (req.accepts("html")) {
    res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ error: "404 Not Found" });
  } else {
    res.type("txt").send("404 Not Found");
  }
});

// or use  handler (catch-all)
// app.use((req, res) => {
//   res.status(404).send("Page not found");
// });

app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
