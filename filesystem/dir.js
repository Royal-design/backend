const path = require("path");
const fs = require("fs");

if (!fs.existsSync("./new")) {
  fs.mkdir("./new", (err) => {
    if (err) throw err;
    console.log("directory created");
  });
}

fs.writeFile(path.join(__dirname, "new", "write.txt"), "hi Emmanuel", (err) => {
  if (err) throw err;
  console.log("write complete");
});

// if (fs.existsSync("./new")) {
//   fs.rmdir("./new", (err) => {
//     if (err) throw err;
//     console.log("directory removed");
//   });
// }

if (!fs.existsSync("./send")) {
  fs.mkdir("./send", (err) => {
    if (err) throw err;
    console.log("cre successfully");
  });
}
