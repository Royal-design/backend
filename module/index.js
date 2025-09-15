import { add, greet } from "./math.js";
import path from "path";
import os from "os";
import { URL, fileURLToPath } from "url";
import EventEmitter from "events";
// import * as fs from "fs/promises";
import fs from "fs";
import http from "http";

// import fs from "fs";

greet("Emmanuel ");

console.log(add(1, 4));

console.log(path.extname("c:\\nodejs\\index.js"));
console.log(os.totalmem());

const myURL = new URL(
  "https://olamide:abs@sub.example.com:8080/p/a/t/h?query=ola&pageSize=1#hash"
);
console.log(myURL);
console.log(myURL.protocol);

const __filename = fileURLToPath(import.meta.url);
const filePath = path.join(path.dirname(__filename), "new", "new.txt");
console.log(path.dirname(__filename));
console.log(filePath);

// const newPath = path.join(path.dirname(__filename), "new", "write.txt");
// try {
//   //   await fs.mkdir("./new", { recursive: true });
//   await fs.writeFile(newPath, "Hi Emmy");
//   await fs.appendFile(newPath, "\n\nHow are you?");
//   await fs.appendFile(newPath, "\n\nI am good");
// } catch (error) {
//   console.log(error);
// }

const PORT = 8000;
// const route = {
//   "/": "<h1>This is home page</h1>",
//   "/about": "<h1>This is about page</h1>",
//   "/settings": "<h1>This is settings page</h1>",
// };
const server = http.createServer((req, res) => {
  if (req.url === "/") {
    res.writeHead(200, "OK", { "content-type": "text/html" });

    fs.readFile("./home.html", "utf-8", (err, data) => {
      if (err) throw err;
      res.end(data);
    });
  } else if (req.url === "/about") {
    res.writeHead(200, "OK", { "content-type": "text/html" });

    fs.readFile("./about.html", "utf-8", (err, data) => {
      if (err) throw err;
      res.end(data);
    });
  } else {
    res.writeHead(404, "Not found", { "content-type": "text/html" });
    res.end("<h1>Page not found</h1>");
  }
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const customEmitter = new EventEmitter();

customEmitter.on("response", (name, id) => {
  console.log(`user: ${name} id:${id}`);
});

customEmitter.emit("response", "Ade", "012");

for (let i = 0; i < 1000; i++) {
  fs.writeFileSync("./data.txt", `${i}\n`, { flag: "a" });
}

const stream = fs.createReadStream("./data.txt", { encoding: "utf8" });
const ws = fs.createWriteStream("./newStream.txt");
// stream.on("data", (data) => {
//   console.log(data);
// });

stream.pipe(ws);
