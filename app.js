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


// app.use(express.static('public'));  
// app.set('view engine', 'ejs');  

// In-memory data store  
// let task = [];  
// Load data from JSON file  
// const loadData = () => {  
//   const data = fs.readFileSync(path.join(__dirname, 'contacts.json'));  
//   return JSON.parse(data);  
// };  
const datafile = path.join(__dirname, "data", "contacts.json");
const readData = () => JSON.parse(fs.readFileSync(datafile));
const writeData= (data) => fs.writeFileSync(datafile, JSON. stringify(data, null, 2));
// save data to JSON file
// const saveData = (data) => {  
//   fs.writeFileSync(path.join(__dirname, 'data.json'), JSON.stringify(data, null, 2));  
// };  

app.use((req, res, next)=>{
  console.log("Time:", Date.now());
  next();
});
app.get("/", (req, res) => {
  //res.send("<h1>Hello World!</h1>"); // Send a response with "Hello World!" when the root URL is accessed
  //res.sendFile(__dirname + "/views/index.html");
  // const nama = "jack";
  // const user = readData();
  res.render("index", { title:"home"});
});

// Define a route for the "/about" URL
app.get("/about", (req, res) => {
  //res.send("About Us"); // Send a response with "About Us" when the "/about" URL is accessed
  //res.sendFile(__dirname + "/views/about.html");
  res.render("about", {title: 'about page'});
});

// Define a route for the "/contact" URL
//app.get("/contact", (req, res) => {
  //res.send("Contact Us"); // Send a response with "Contact Us" when the "/contact" URL is accessed
  //res.sendFile(__dirname + "/views/contact.html");
  //const contact = {  
    //name: 'John Doe',  
    //email: 'john.doe@example.com',  
    //phone: '123-456-7890'  
  //};  
  //res.render("contact");
//};
app.get("/contact", (req, res) => {  
  //const contact = [  
  //  { name: 'Jack', email: 'jackma@gmail.com', phone: '08152987665' },  
  //{ name: 'Syukri', email: 'syukri@gmail.com', phone: '081398899003' },  
  // { name: 'Ayyas', email: 'ayyas@gmail.com', phone: '081804789553' }  
  //];  
  // Load the JSON file  
  const tasks = readData();
  // Render the template with the contacts data  
  res.render('contact', { tasks, title: "Contact" });  
  });
//
// app.get('/create', (req, res) => {  
// res.render('create',  {tasks, title: 'Create Task' });  
// });  
// //
// app.post('/create', (req, res) => {  
//   const newTask = req.body.task;  
//   tasks.push(newTask);  
//   res.redirect('/');  
// });  
// //
// // Update (Show form to edit a task)  
// app.get('/edit/:index', (req, res) => {  
//   const index = req.params.index;  
//   const taskToEdit = tasks[index];  
//   res.render('edit', { title: 'Edit Task', task: taskToEdit, index });  
// });  

// // Update (Handle form submission)  
// app.post('/edit/:index', (req, res) => {  
//   const index = req.params.index;  
//   tasks[index] = req.body.task;  
//   res.redirect('/');  
// });  

// // Delete (Handle delete request)  
// app.post('/delete/:index', (req, res) => {  
//   const index = req.params.index;  
//   tasks.splice(index, 1);  
//   res.redirect('/');  
// });  
app.post('/create', (req, res) => {  
  const tasks = readData() 
  const newtask = {
   id : tasks.length ? tasks[tasks.length -1].id + 1 :1,
   name : req.body.name,
   mobile :  req.body.mobile,
   email : req.body.email,
  };
  tasks.push(newtask); 
  writeData(tasks); 
  // res.render(/, {tasks}
  res.redirect('/');  
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
app.get('/update/:id'), (req, res) => {
  const tasks = readData();
  const task = tasks.find((t) => t.id == req.params.id);
  res.render('edit', {task});
}
app.post('/update/:id', (req, res) => {  
  const tasks = readData();  
  const task = tasks.find((t) => t.id == req.params.id);  
  // res.render('edit', {task})
  if (task > -1) {
      tasks[task] = {  
      id : tasks[task].id,
      name : req.body.name,
      mobile : req.body.mobile,
      email : req.body.email
      }; 
  writeData(tasks); 
    } 
  res.redirect('/contact');  
});  

app.post('/delete/:id', (req, res) => {  
  let tasks = readData();  
  tasks = tasks.filter((t) => t.id !== req.params.id);  
  writeData(tasks);  
  res.redirect('/');  
});  

 // res.render("contact", { contact }); // Pass the contact variable to the template  
//});
// Define a middleware to handle 404 errors (page not found)
app.use((req, res) => {
  res.status(404).send("404 : Page not found Broo!"); // Send a 404 response when no route matches the request
});

// Start the server and listen on the specified port
app.listen(port, () => {
  console.log(`Server is running on port ${port}`); // Log a message indicating that the server is running
});
// In this snippet, we have created a basic Express server that listens on port 3000 and responds with "Hello World!" when a GET request is made to the root URL ("/"). This is a simple example of how to create a server using Express and handle requests.
