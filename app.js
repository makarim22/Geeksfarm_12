// Import 'express' module
const express = require("express"); 

// path
const path = require('path');

// import modul express-ejs
const ejsLayouts = require('express-ejs-layouts'); 
const morgan = require("morgan");

// import modul file system
const fs = require('fs');

// Create an instance of an Express application
const app = express(); 

// body-parser
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));  
// Define the port to be used by the server
const port = 3000; 
app.use(morgan("dev"));

// set view engine to EJS
app.set("view engine", "ejs");

// gunakan express-ejs-layouts
app.use(ejsLayouts);  

// atur file layout detail
app.set("layout", "layouts/layout")
app.use(express.static(path.join(__dirname, "public")));
const datafile = path.join(__dirname, "data", "contacts.json");
const readData = () => JSON.parse(fs.readFileSync(datafile));
const writeData= (data) => fs.writeFileSync(datafile, JSON. stringify(data, null, 2));
function getTasks() {  
    const dataPath = path.join(__dirname, '/data/contacts.json'); // Adjust the path as needed  
    const data = fs.readFileSync(dataPath);  
    return JSON.parse(data);  
}  
app.use((req, res, next)=>{
  console.log("Time:", Date.now());
  next();
});
app.get("/", (req, res) => {
  res.render("index", { title:"home"});
});

// Define a route for the "/about" URL
app.get("/about", (req, res) => {
  res.render("about", {title: 'about page'});
});

app.get("/contact", (req, res) => {  
  const tasks = readData();
  console.log(tasks)
  // Render the template with the contacts data  
  res.render('contact', { tasks, title: "Contact" });  
  });

app.post('/add', (req, res) => {  
  const tasks = readData();  
  tasks.push({ id: Date.now(), 
    name: req.body.name, 
    mobile: req.body.mobile,
    email: req.body.email
    });   
  writeData(tasks);  
  res.redirect('contact');  
}); 

app.get("/edit/:id", (req, res) => {
  console.log(1);
  const tasks = readData();
  const task = tasks.find((t) => t.id == req.params.id);
  if (!task) {  
    return res.status(404).send("Contact not found");  
  }  
  res.render('edit', { task, title: 'Edit Contact' }); 
});

// Update a contact (handle form submission)  
app.post('/edit/:id', (req, res) => {  
  const tasks = readData();  
  const taskIndex = tasks.findIndex(t => t.id == req.params.id);  
  if (taskIndex > -1) {  
      tasks[taskIndex] = {  
          id: tasks[taskIndex].id,  
          name: req.body.name,  
          mobile: req.body.mobile,  
          email: req.body.email,  
      };  
      writeData(tasks);  
  }  
  res.redirect('/contact');  
});  
// app.post('/register', [  
//   // Validate and sanitize fields  
//   body('name')  
//       .isLength({ min: 3 }).withMessage('Username must be at least 3 characters long')  
//       .isAlphanumeric().withMessage('Username must be alphanumeric'),  
//   body('email')  
//       .isEmail().withMessage('Must be a valid email address')  
//       .normalizeEmail(),  
//   body('mobile')  
//       .isMobilePhone('any').withMessage('Must be a valid mobile phone number'), // Validate mobile phone  
// ], (req, res) => {  
//   // Handle validation errors  
//   const errors = validationResult(req);  
//   if (!errors.isEmpty()) {  
//       return res.status(400).json({ errors: errors.array() });  
//   }  

//   // If validation passes, proceed with user registration logic  
//   const { username, email, password } = req.body;  
//   // Here you would typically save the user to the database  
//   res.status(201).json({ message: 'User registered successfully', user: { username, email } });  
// });


// Function to get tasks from a JSON file  
// Function to delete a task by ID  
function deleteTask(taskId) {  
    // Get the current list of tasks  
    let tasks = getTasks();  

    // Filter out the task with the specified ID  
    tasks = tasks.filter((task) => task.id !== taskId);  

    // Write the updated tasks back to the data source  
    writeData(tasks);  
}  

// Route to delete a task  
app.post('/delete/:id', (req, res) => {  
    // Retrieve the ID of the task to delete  
    const taskIdToDelete = req.params.id;  

    // Call the deleteTask function  
    deleteTask(taskIdToDelete);  

    // Redirect to the contact page or wherever you want  
    res.redirect('/contact'); // Uncomment this line to enable redirection  
});  

// app.use((req, res) => {
//   res.status(404).send("404 : Page not found Broo!"); // Send a 404 response when no route matches the request
// });

// Start the server and listen on the specified port
app.listen(port, () => {
  console.log(`Server is running on port ${port}`); // Log a message indicating that the server is running
});
