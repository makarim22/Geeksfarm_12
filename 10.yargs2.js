const yargs = require("yargs"); // Import 'yargs' module for command-line argument parsing
const validator = require("validator"); // Import 'validator' module for validation
const {
  addContact,
  listContacts,
  detailContact,
  deleteContact,
  updateContact,
  rl,
} = require("./src/func"); // Import functions from 'src/func'

// Define the 'add' command
yargs.command({
  command: "add",
  describe: "add new contact",
  builder: {
    name: {
      describe: "contact name",
      demandOption: true, // This option is required
      type: "string", // The type of this option is string
    },
    mobile: {
      describe: "contact mobile",
      demandOption: true, // This option is required
      type: "string", // The type of this option is string
    },
    email: {
      describe: "contact email",
      demandOption: false, // This option is optional
      type: "string", // The type of this option is string
    },
  },
  handler(argv) {
    // Handler function for the 'add' command
    const contact = {
      name: argv.name,
      mobile: argv.mobile,
      email: argv.email,
    };

    let isValid = true;
    let errorMessage = "";

    // Validate mobile number
    if (!validator.isMobilePhone(argv.mobile, "any")) {
      isValid = false;
      errorMessage += "Invalid mobile number. ";
    }

    // Validate email address if provided
    if (argv.email && !validator.isEmail(argv.email)) {
      isValid = false;
      errorMessage += "Invalid email address. ";
    }

    // If validation passes, add the contact
    if (isValid) {
      addContact(contact);
    } else {
      // If validation fails, print the error message
      console.log(errorMessage);
    }
  },
});

// Define the 'list' command
yargs.command({
  command: "list",
  describe: "list all contacts",
  handler() {
    // Handler function for the 'list' command
    listContacts();
  },
});

// Define the 'detail' command
yargs.command({
  command: "detail",
  describe: "show contact details",
  builder: {
    name: {
      describe: "contact name",
      demandOption: true, // This option is required
      type: "string", // The type of this option is string
    },
  },
  handler(argv) {
    // Handler function for the 'detail' command
    detailContact(argv.name);
  },
});

// Define the 'delete' command
yargs.command({
  command: "delete",
  describe: "delete a contact",
  builder: {
    name: {
      describe: "contact name",
      demandOption: true, // This option is required
      type: "string", // The type of this option is string
    },
  },
  handler(argv) {
    // Handler function for the 'delete' command
    deleteContact(argv.name);
  },
});

// Define the 'update' command
yargs.command({
  command: "update",
  describe: "update a contact",
  builder: {
    name: {
      describe: "contact name",
      demandOption: true, // This option is required
      type: "string", // The type of this option is string
    },
    newMobile: {
      describe: "new contact mobile",
      demandOption: false, // This option is optional
      type: "string", // The type of this option is string
    },
    newEmail: {
      describe: "new contact email",
      demandOption: false, // This option is optional
      type: "string", // The type of this option is string
    },
  },
  handler(argv) {
    // Handler function for the 'update' command
    const updatedContact = {
      name: argv.name,
      newMobile: argv.newMobile,
      newEmail: argv.newEmail,
    };

    updateContact(updatedContact);
  },
});

// Parse the command-line arguments
yargs.parse();
rl.close();
