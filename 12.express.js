const express = require("express");
const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send("<h1>Hello World!</h1>");
});

app.get("/about", (req, res) => {
  res.send("About Us");
});

app.get("/contact", (req, res) => {
  res.send("Contact Us");
});

app.use((req, res) => {
  res.status(404).send("404 : Page not found Broo!");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
// In this snippet, we have created a basic Express server that listens on port 3000 and responds with "Hello World!" when a GET request is made to the root URL ("/"). This is a simple example of how to create a server using Express and handle requests.
