//modul untuk file system
const fs = require("fs");

//membuat file test.txt dengan isi Hello, World! CUY!
fs.writeFileSync("test.txt", "Hello, World! CUY!");
