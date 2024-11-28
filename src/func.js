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

//DENGAN MENGGUNAKAN YARGS, KITA TIDAK MENGGUNAKAN FUNCTION QUESTION
const question = (questions) => {
  return new Promise((resolve, rejects) => {
    rl.question(questions, (input) => {
      resolve(input);
    });
  });
};

const readContact = () => {
  const contacts = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
  return contacts;
};

const addContact = async (contact) => {
  const contacts = readContact();
  contacts.push(contact);
  saveContacts(contacts);
  console.log("data added successfully!");
};

const saveContacts = (contacts) => {
  fs.writeFileSync(dataPath, JSON.stringify(contacts));
};

const listContacts = () => {
  const contacts = readContact();
  console.log("List of contacts:");
  contacts.forEach((contact, index) => {
    console.log(`${index + 1}. ${contact.name} - ${contact.mobile}`);
  });
};

const detailContact = (name) => {
  const contacts = readContact();
  const contact = contacts.find(
    (contact) => contact.name.toLowerCase() === name.toLowerCase()
  );
  if (contact) {
    console.log(`Name: ${contact.name}`);
    console.log(`Mobile: ${contact.mobile}`);
    if (contact.email) {
      console.log(`Email: ${contact.email}`);
    }
  } else {
    console.log(`Contact with name ${name} not found.`);
  }
};

const deleteContact = (name) => {
  const contacts = readContact();
  const filteredContacts = contacts.filter(
    (contact) => contact.name.toLowerCase() !== name.toLowerCase()
  );
  if (contacts.length === filteredContacts.length) {
    console.log(`Contact with name ${name} not found.`);
  } else {
    saveContacts(filteredContacts);
    console.log(`Contact with name ${name} has been deleted.`);
  }
};

const updateContact = (oldName, name, mobile, email) => {
  const contacts = readContact();
  const contactIndex = contacts.findIndex(
    (contact) => contact.name.toLowerCase() === oldName.toLowerCase()
  );

  if (contactIndex !== -1) {
    contacts[contactIndex] = { name, mobile, email };
    saveContacts(contacts);
    console.log(`Contact with name ${oldName} has been updated.`);
  } else {
    console.log(`Contact with name ${oldName} not found.`);
  }
};

module.exports = {
  addContact,
  listContacts,
  detailContact,
  deleteContact,
  updateContact,
  rl,
};
