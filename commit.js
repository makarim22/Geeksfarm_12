const { exec } = require("child_process"); // Import modul 'child_process' untuk menjalankan perintah shell
const readline = require("readline"); // Import modul 'readline' untuk membaca input dari pengguna

// Membuat antarmuka readline untuk membaca input dari stdin dan menulis output ke stdout
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Menanyakan pesan commit kepada pengguna
rl.question("Enter commit message: ", (message) => {
  // Menjalankan perintah 'git add .' untuk menambahkan semua perubahan ke staging area
  exec("git add .", (err, stdout, stderr) => {
    if (err) {
      // Jika terjadi kesalahan saat menjalankan 'git add .', cetak pesan kesalahan dan tutup antarmuka readline
      console.error(`Error adding files: ${stderr}`);
      rl.close();
      return;
    }

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

    // Menjalankan perintah 'git push -u origin master' untuk mendorong commit ke repository remote
    exec("git push -u origin master", (err, stdout, stderr) => {
      if (err) {
        // Jika terjadi kesalahan saat menjalankan 'git push', cetak pesan kesalahan dan tutup antarmuka readline
        console.error(`Error pushing files: ${stderr}`);
        rl.close();
        return;
      }

      // Jika push berhasil, cetak pesan sukses
      console.log("Files pushed successfully.");
      // Tutup antarmuka readline
      rl.close();
    });
  });
});
