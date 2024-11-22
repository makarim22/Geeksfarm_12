const func = require("./src/func");
const validator = require("validator");

const main = async () => {
  const name = await func.question("Your name: ");

  let mobile;
  do {
    mobile = await func.question("Your mobile: ");
    if (!validator.isMobilePhone(mobile, "any")) {
      console.log("Invalid mobile format. Please enter a valid mobile number.");
    }
  } while (!validator.isMobilePhone(mobile, "any"));

  let email;
  do {
    email = await func.question("Your e-mail: ");
    if (!validator.isEmail(email)) {
      console.log("Invalid email format. Please enter a valid email address.");
    }
  } while (!validator.isEmail(email));

  const contact = {
    name,
    mobile,
    email,
  };

  func.addContact(contact);
  func.rl.close();
};

main();
