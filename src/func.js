const readline = require("readline"); // Import modul 'readline' untuk membaca input dari pengguna
const validator = require("validator"); // Import modul 'validator' untuk validasi
const fs = require("fs"); // Import modul 'fs' untuk operasi file
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

//BELUM BERHASIL UNTUK MEMBUAT MENJADI SYNC
// const question = (questions, callback) => {
//   rl.question(questions, (input) => {
//     callback(input);
//   });
// };

const question = (questions) => {
  return new Promise((resolve, rejects) => {
    rl.question(questions, (input) => {
      resolve(input);
    });
  });
};

const addContact = async (contact) => {
  const contacts = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
  contacts.push(contact);
  saveContacts(contacts);
};

const saveContacts = (contacts) => {
  fs.writeFileSync(dataPath, JSON.stringify(contacts));
  console.log("data added successfully!");
};

module.exports = { question, addContact, rl };
