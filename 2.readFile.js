const fs = require("fs");
//const ff = require("./2.readFile")

//membaca file test.txt
fs.readFile("test.txt", "utf-8", (err, data) => {
  if (err) throw err;
  console.log(data);
});
