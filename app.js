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
  res.redirect('/contact'); 
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
app.get('/edit/:id'), (req, res) => {
  const tasks = readData();
  const task = tasks.find((t) => t.id == req.params.id);
  if (!task) {  
    return res.status(404).send("Contact not found");  
  }  
  res.render('edit', { task, title: 'Edit Contact' }); 
//  res.render('edit', {task});
}

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

app.post('/delete/:id', (req, res) => {  
  let tasks = readData();  
  tasks = tasks.filter((t) => t.id !== req.params.id);  
  writeData(tasks);  
  res.redirect('/contact');
});  


app.use((req, res) => {
  res.status(404).send("404 : Page not found Broo!"); // Send a 404 response when no route matches the request
});

// Start the server and listen on the specified port
app.listen(port, () => {
  console.log(`Server is running on port ${port}`); // Log a message indicating that the server is running
});
