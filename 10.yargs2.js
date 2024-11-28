const yargs = require("yargs");
const validator = require("validator");
const {
  addContact,
  listContacts,
  detailContact,
  deleteContact,
  updateContact,
  rl,
} = require("./src/func");

yargs.command({
  command: "add",
  describe: "add new contact",
  builder: {
    name: {
      describe: "contact name",
      demandOption: true,
      type: "string",
    },
    mobile: {
      describe: "contact mobile",
      demandOption: true,
      type: "string",
    },
    email: {
      describe: "contact email",
      demandOption: false,
      type: "string",
    },
  },
  handler(argv) {
    const contact = {
      name: argv.name,
      mobile: argv.mobile,
      email: argv.email,
    };

    let isValid = true;
    let errorMessage = "";

    if (!validator.isMobilePhone(argv.mobile, "any")) {
      isValid = false;
      errorMessage += "Invalid mobile number. ";
    }

    if (argv.email && !validator.isEmail(argv.email)) {
      isValid = false;
      errorMessage += "Invalid email address. ";
    }

    if (isValid) {
      addContact(contact);
    } else {
      console.log(errorMessage);
    }
  },
});

yargs.command({
  command: "list",
  describe: "list all contacts",
  handler() {
    listContacts();
  },
});

yargs.command({
  command: "detail",
  describe: "show contact details",
  builder: {
    name: {
      describe: "contact name",
      demandOption: true,
      type: "string",
    },
  },
  handler(argv) {
    detailContact(argv.name);
  },
});

yargs.command({
  command: "delete",
  describe: "delete a contact",
  builder: {
    name: {
      describe: "contact name",
      demandOption: true,
      type: "string",
    },
  },
  handler(argv) {
    deleteContact(argv.name);
  },
});

yargs.command({
  command: "update",
  describe: "update an existing contact",
  builder: {
    name: {
      describe: "contact name",
      demandOption: true,
      type: "string",
    },
    newName: {
      describe: "new contact name",
      demandOption: false,
      type: "string",
    },
    newMobile: {
      describe: "new contact mobile",
      demandOption: false,
      type: "string",
    },
    newEmail: {
      describe: "new contact email",
      demandOption: false,
      type: "string",
    },
  },
  handler(argv) {
    let isValid = true;
    let errorMessage = "";

    if (argv.newMobile && !validator.isMobilePhone(argv.newMobile, "any")) {
      isValid = false;
      errorMessage += "Invalid mobile number. ";
    }

    if (argv.newEmail && !validator.isEmail(argv.newEmail)) {
      isValid = false;
      errorMessage += "Invalid email address. ";
    }

    if (isValid) {
      updateContact(argv.name, argv.newName, argv.newMobile, argv.newEmail);
    } else {
      console.log(errorMessage);
    }
  },
});

yargs.parse();
rl.close();
