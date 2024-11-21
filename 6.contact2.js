const readline = require("readline"); // Import modul 'readline' untuk membaca input dari pengguna
const validator = require("validator"); // Import modul 'validator' untuk validasi
const fs = require("fs"); // Import modul 'fs' untuk operasi file
const { resolve } = require("path");
const { rejects } = require("assert");
const dirPath = "./data"; // Menyimpan path direktori data
const dataPath = "./data/contacts.json"; // Menyimpan path file contacts.json

// Membuat antarmuka readline untuk membaca input dari stdin dan menulis output ke stdout
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

//membuat folder data apabila tidak ada
if (!fs.existsSync(dirPath)) {
  fs.mkdirSync(dirPath);
}

// membuat file contacts.json apabila tidak ada
if (!fs.existsSync(dataPath)) {
  fs.writeFileSync(dataPath, "[]", "utf-8");
  // fs.writeFile("./data/contacts.json", "[]", "utf-8", (err) => {
  //   if (err) throw err;
  // });
}

// Menanyakan nama kepada pengguna
rl.question("Your name: ", (name) => {
  // Menanyakan nomor telepon setelah nama diberikan
  rl.question("Your mobile: ", (mobile) => {
    // Menanyakan email setelah nomor telepon diberikan
    rl.question("Your email: ", (email) => {
      // Validasi nomor telepon dan email
      const isMobileValid = validator.isMobilePhone(mobile, "id-ID");
      const isEmailValid = validator.isEmail(email);

      // Menampilkan semua informasi yang diberikan oleh pengguna
      console.log(`Name : ${name}`);
      console.log(
        `Mobile : ${mobile} (${isMobileValid ? "Valid" : "Invalid"})`
      );
      console.log(`Email : ${email} (${isEmailValid ? "Valid" : "Invalid"})`);

      // Membuat objek contact dengan informasi yang diberikan oleh pengguna
      const contact = {
        name,
        mobile,
        email,
      };

      // Membaca file contacts.json dan menguraikan isinya menjadi array
      const contacts = JSON.parse(
        fs.readFileSync("data/contacts.json", "utf-8")
      );

      // Menambahkan objek contact baru ke dalam array contacts
      contacts.push(contact);

      // Menulis kembali array contacts yang telah diperbarui ke dalam file contacts.json
      fs.writeFileSync("data/contacts.json", JSON.stringify(contacts));

      // Menutup antarmuka readline
      rl.close();
    });
  });
});
