const http = require("http"); // Import 'http' module to create a server
const fs = require("fs"); // Import 'fs' module for file operations
const port = 3000; // Define the port to be used by the server

// Create an HTTP server
http
  .createServer((req, res) => {
    const url = req.url; // Get the URL from the request
    console.log(url); // Log the requested URL to the console

    // Function to render HTML file
    const renderHtml = (path, res) => {
      fs.readFile(path, (err, data) => {
        if (err) {
          // If an error occurs while reading the file
          console.log(err); // Log the error message to the console
          res.write("Error"); // Write an error message to the response
          res.end(); // End the response
        } else {
          // If the file is successfully read
          res.writeHead(200, { "Content-Type": "text/html" }); // Write the response header with status 200 and content type HTML
          res.write(data); // Write the file data to the response
          res.end(); // End the response
        }
      });
    };

    // Check the URL and render the corresponding HTML file
    if (url === "/about") {
      renderHtml("./views/about.html", res); // Render the about page
    } else if (url === "/contact") {
      renderHtml("./views/contact.html", res); // Render the contact page
    } else if (url === "/") {
      renderHtml("./views/index.html", res); // Render the index page
    } else {
      // If the URL does not match any route
      res.writeHead(404, { "Content-Type": "text/html" }); // Write the response header with status 404 and content type HTML
      res.write("404 : Page not found Broo!"); // Write a 404 error message to the response
      res.end(); // End the response
    }
  })
  .listen(port, () => {
    // Start the server on the specified port
    console.log(`Server is running on port ${port}`); // Log a message indicating that the server is running
  });
