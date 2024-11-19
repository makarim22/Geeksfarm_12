const { exec } = require("child_process");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("Enter commit message: ", (message) => {
  exec("git add .", (err, stdout, stderr) => {
    if (err) {
      console.error(`Error adding files: ${stderr}`);
      rl.close();
      return;
    }

    exec(`git commit -m "${message}"`, (err, stdout, stderr) => {
      if (err) {
        console.error(`Error committing files: ${stderr}`);
      } else {
        console.log("Files committed successfully.");
      }
      rl.close();
    });
  });
});
