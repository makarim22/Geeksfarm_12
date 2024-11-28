const express = require("express"); // Import 'express' module
const app = express(); // Create an instance of an Express application
const port = 3000; // Define the port to be used by the server

// Define a route for the root URL ("/")
app.get("/", (req, res) => {
  res.send("<h1>Hello World!</h1>"); // Send a response with "Hello World!" when the root URL is accessed
});

// Define a route for the "/about" URL
app.get("/about", (req, res) => {
  res.send("About Us"); // Send a response with "About Us" when the "/about" URL is accessed
});

// Define a route for the "/contact" URL
app.get("/contact", (req, res) => {
  res.send("Contact Us"); // Send a response with "Contact Us" when the "/contact" URL is accessed
});

// Define a middleware to handle 404 errors (page not found)
app.use((req, res) => {
  res.status(404).send("404 : Page not found Broo!"); // Send a 404 response when no route matches the request
});

// Start the server and listen on the specified port
app.listen(port, () => {
  console.log(`Server is running on port ${port}`); // Log a message indicating that the server is running
});
// In this snippet, we have created a basic Express server that listens on port 3000 and responds with "Hello World!" when a GET request is made to the root URL ("/"). This is a simple example of how to create a server using Express and handle requests.
