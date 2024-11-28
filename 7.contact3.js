const readline = require("readline"); // Import modul 'readline' untuk membaca input dari pengguna
const validator = require("validator"); // Import modul 'validator' untuk validasi
const fs = require("fs"); // Import 'fs' module for file operations
const dirPath = "./data"; // Define the directory path for storing data
const dataPath = "./data/contacts.json"; // Define the file path for storing contacts

// Membuat antarmuka readline untuk membaca input dari stdin dan menulis output ke stdout
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Create the 'data' folder if it does not exist
if (!fs.existsSync(dirPath)) {
  fs.mkdirSync(dirPath);
}

// Create the 'contacts.json' file if it does not exist
if (!fs.existsSync(dataPath)) {
  fs.writeFileSync(dataPath, "[]", "utf-8");
  // fs.writeFile("./data/contacts.json", "[]", "utf-8", (err) => {
  //   if (err) throw err;
  // });
}

// Function to ask a question and return the input as a promise
const question = (questions) => {
  return new Promise((resolve, rejects) => {
    rl.question(questions, (input) => {
      resolve(input);
    });
  });
};

// Main function to collect user input and save the contact
const main = async () => {
  const name = await question("Your name: "); // Ask for the user's name
  const mobile = await question("Your mobile: "); // Ask for the user's mobile number
  const email = await question("Your email: "); // Ask for the user's email

  // Create a contact object with the provided information
  const contact = {
    name,
    mobile,
    email,
  };

  // Read existing contacts from the file
  const fileBuffer = fs.readFileSync(dataPath, "utf-8");
  const contacts = JSON.parse(fileBuffer);

  // Add the new contact to the contacts array
  contacts.push(contact);

  // Save the updated contacts array to the file
  fs.writeFileSync(dataPath, JSON.stringify(contacts));

  console.log("Contact saved successfully!");

  // Close the readline interface
  rl.close();
};

// Call the main function to start the process
main();
