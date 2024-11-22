const yargs = require("yargs");
const validator = require("validator");

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
      console.log(contact);
    } else {
      console.log(errorMessage);
    }
  },
});

yargs.parse();
