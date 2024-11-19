const fs = require("fs");

//membaca file test.txt
fs.readFile("test.txt", "utf-8", (err, data) => {
  if (err) throw err;
  console.log(data);
});
