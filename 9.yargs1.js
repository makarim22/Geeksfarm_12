const yargs = require("yargs"); // Import 'yargs' module for command-line argument parsing
const validator = require("validator"); // Import 'validator' module for validation

// Define the 'add' command
yargs.command({
  command: "add",
  describe: "add new contact", // Description of the command
  builder: {
    name: {
      describe: "contact name", // Description of the 'name' option
      demandOption: true, // This option is required
      type: "string", // The type of this option is string
    },
    mobile: {
      describe: "contact mobile", // Description of the 'mobile' option
      demandOption: true, // This option is required
      type: "string", // The type of this option is string
    },
    email: {
      describe: "contact email", // Description of the 'email' option
      demandOption: false, // This option is optional
      type: "string", // The type of this option is string
    },
  },
  handler(argv) {
    // Handler function for the 'add' command
    const contact = {
      name: argv.name, // Get the 'name' argument
      mobile: argv.mobile, // Get the 'mobile' argument
      email: argv.email, // Get the 'email' argument
    };

    let isValid = true; // Flag to check if the input is valid
    let errorMessage = ""; // Variable to store error messages

    // Validate mobile number
    if (!validator.isMobilePhone(argv.mobile, "any")) {
      isValid = false;
      errorMessage += "Invalid mobile number. "; // Append error message if mobile number is invalid
    }

    // Validate email address if provided
    if (argv.email && !validator.isEmail(argv.email)) {
      isValid = false;
      errorMessage += "Invalid email address. "; // Append error message if email address is invalid
    }

    // If validation passes, add the contact
    if (isValid) {
      // Add contact logic here (e.g., save to a file or database)
      console.log("Contact added successfully:", contact);
    } else {
      // If validation fails, print the error message
      console.log(errorMessage);
    }
  },
});

// Parse the command-line arguments
yargs.parse();
