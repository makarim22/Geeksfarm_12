const readline = require("readline"); // Import modul 'readline' untuk membaca input dari pengguna

// Membuat antarmuka readline untuk membaca input dari stdin dan menulis output ke stdout
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Menanyakan nama kepada pengguna
rl.question("Your name: ", (name) => {
  // Menanyakan nomor telepon setelah nama diberikan
  rl.question("Your mobile: ", (mobile) => {
    // Menanyakan email setelah nomor telepon diberikan
    rl.question("Your email: ", (email) => {
      // Menampilkan semua informasi yang diberikan oleh pengguna
      console.log(`Name: ${name}`);
      console.log(`Mobile: ${mobile}`);
      console.log(`Email: ${email}`);
      // Menutup antarmuka readline
      rl.close();
    });
  });
});
