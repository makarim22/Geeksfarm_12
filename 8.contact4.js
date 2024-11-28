const func = require("./src/func"); // Import functions from 'src/func'
const validator = require("validator"); // Import 'validator' module for validation

const main = async () => {
  // Ask for the user's name
  const name = await func.question("Your name: ");

  let mobile;
  // Loop until a valid mobile number is provided
  do {
    mobile = await func.question("Your mobile: ");
    if (!validator.isMobilePhone(mobile, "any")) {
      console.log("Invalid mobile format. Please enter a valid mobile number."); // Print error message if mobile number is invalid
    }
  } while (!validator.isMobilePhone(mobile, "any"));

  let email;
  // Loop until a valid email address is provided
  do {
    email = await func.question("Your e-mail: ");
    if (!validator.isEmail(email)) {
      console.log("Invalid email format. Please enter a valid email address."); // Print error message if email address is invalid
    }
  } while (!validator.isEmail(email));

  // Create a contact object with the provided information
  const contact = {
    name,
    mobile,
    email,
  };

  // Add the contact using the addContact function
  func.addContact(contact);
  // Close the readline interface
  func.rl.close();
};

// Call the main function to start the process
main();
