const { exec } = require("child_process"); // Import modul 'child_process' untuk menjalankan perintah shell
const readline = require("readline"); // Import modul 'readline' untuk membaca input dari pengguna

// Membuat antarmuka readline untuk membaca input dari stdin dan menulis output ke stdout
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let filesToAdd = [];

// Fungsi untuk menanyakan file apa saja yang akan ditambahkan ke staging area
function askForFiles() {
  rl.question(
    "Enter files to add (use 'end' to finish, '.' to add all files): ",
    (files) => {
      if (files.trim() === "end") {
        // Jika pengguna mengetik 'end', lanjutkan ke langkah berikutnya
        const addCommand = filesToAdd.includes(".")
          ? "git add ."
          : `git add ${filesToAdd.join(" ")}`;
        execAddCommand(addCommand);
      } else {
        // Tambahkan file ke daftar filesToAdd
        filesToAdd.push(files.trim());
        // Tanyakan lagi
        askForFiles();
      }
    }
  );
}

// Fungsi untuk menjalankan perintah 'git add'
function execAddCommand(addCommand) {
  exec(addCommand, (err, stdout, stderr) => {
    if (err) {
      // Jika terjadi kesalahan saat menjalankan 'git add', cetak pesan kesalahan dan tutup antarmuka readline
      console.error(`Error adding files: ${stderr}`);
      rl.close();
      return;
    }

    // Menanyakan pesan commit kepada pengguna
    rl.question("Enter commit message: ", (message) => {
      // Menjalankan perintah 'git commit -m "<message>"' untuk membuat commit dengan pesan yang diberikan
      exec(`git commit -m "${message}"`, (err, stdout, stderr) => {
        if (err) {
          // Jika terjadi kesalahan saat menjalankan 'git commit', cetak pesan kesalahan
          console.error(`Error committing files: ${stderr}`);
        } else {
          // Jika commit berhasil, cetak pesan sukses
          console.log("Files committed successfully.");
        }
        // Tutup antarmuka readline
        rl.close();
      });
    });
  });
}

// Mulai dengan menanyakan file apa saja yang akan ditambahkan ke staging area
askForFiles();
