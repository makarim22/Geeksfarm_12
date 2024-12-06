// Import 'express' module  
const express = require("express");   
const path = require('path');  
const ejsLayouts = require('express-ejs-layouts');   
const morgan = require("morgan");  
const fs = require('fs');  

// Create an instance of an Express application  
const app = express();   

// validator
const { body, validationResult } = require('express-validator'); 
// Middleware for body parsing  
app.use(express.urlencoded({ extended: true }));  
app.use(morgan("dev"));  

// Set view engine to EJS  
app.set("view engine", "ejs");  
app.use(ejsLayouts);  
app.set("layout", "layouts/layout");  
app.use(express.static(path.join(__dirname, "public")));  

// Define the data file path  
const datafile = path.join(__dirname, "data", "contacts.json");  

// Function to read data from the JSON file  
const readData = () => {  
    try {  
        return JSON.parse(fs.readFileSync(datafile));  
    } catch (error) {  
        console.error("Error reading data:", error);  
        return []; // Return an empty array on error  
    }  
};   
// Function to write data to the JSON file  
const writeData = (data) => {  
    try {  
        fs.writeFileSync(datafile, JSON.stringify(data, null, 2));  
    } catch (error) {  
        console.error("Error writing data:", error);  
    }  
};

// Middleware to log the request time  
app.use((req, res, next) => {  
    console.log("Time:", Date.now());  
    next();  
});  

// Home route  
app.get("/", (req, res) => {  
    res.render("index", { title: "Home" });  
});  

// About route  
app.get("/about", (req, res) => {  
    res.render("about", { title: 'About Page' });  
});  

// Contact route  
app.get("/contact", (req, res) => {  
    const tasks = readData();  
    res.render('contact', { tasks, title: "Contact" });  
});  

//Add a new contact  
app.post('/add', (req, res) => {  
    const tasks = readData();  
    tasks.push({   
        id: Date.now().toString(), // Ensure ID is a string  
        name: req.body.name,   
        mobile: req.body.mobile,  
        email: req.body.email  
    });   
    writeData(tasks);  
    res.redirect('/contact');  
});   
// /// new with validator
// app.post('/add', [  
//     body('name')  
//         .isLength({ min: 3 }).withMessage('Username must be at least 3 characters long')  
//         .isAlphanumeric().withMessage('Username must be alphanumeric'),  
//     body('mobile')  
//         .isMobilePhone('any').withMessage('Must be a valid mobile phone number'),  
//     body('email')  
//         .isEmail().withMessage('Must be a valid email address')  
//         .normalizeEmail(),  
// ], (req, res) => {  
//     const errors = validationResult(req);  
//     if (!errors.isEmpty()) {  
//         return res.render('add', { errors: errors.array() }); // Render the add form with errors  
//     }  

//     const tasks = readData();  
//     tasks.push({  
//         id: Date.now().toString(),  
//         name: req.body.name,  
//         mobile: req.body.mobile,  
//         email: req.body.email,  
//     });  
//     writeData(tasks);  
//     res.redirect('/contact');  
// });  

///
//Route to display the edit form  
app.get("/edit/:id", (req, res) => {  
    const tasks = readData();  
    const task = tasks.find((t) => t.id === req.params.id); // Compare as strings  
    if (!task) {  
        return res.status(404).send("Contact not found");  
    }  
    res.render('edit', { task, title: 'Edit Contact' });  
});  

//
app.get("/edit/:id", (req, res) => {
    const tasks = readData();
    const task = tasks.find((t) => t.id == req.params.id);
    if (!task) {  
      return res.status(404).send("Contact not found");  
    }  
    res.render('edit', { tasks, title: 'Edit Contact' }); 
  });
  //
//Update a contact (handle form submission)  
app.post('/edit/:id', (req, res) => {  
    const tasks = readData();  
    const taskIndex = tasks.findIndex(t => t.id === req.params.id); // Compare as strings  
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

/// new edit with validation
// // Update a contact with validation  
// app.post('/edit/:id', [  
//     body('name')  
//         .isLength({ min: 3 }).withMessage('Username must be at least 3 characters long')  
//         .isAlphanumeric().withMessage('Username must be alphanumeric'),  
//     body('mobile')  
//         .isMobilePhone('any').withMessage('Must be a valid mobile phone number'),  
//     body('email')  
//         .isEmail().withMessage('Must be a valid email address')  
//         .normalizeEmail(),  
// ], (req, res) => {  
//     const errors = validationResult(req);  
//     if (!errors.isEmpty()) {  
//         const task = readData().find(t => t.id === req.params.id);  
//         return res.render('edit', { task, errors: errors.array() }); // Render the edit form with errors  
//     }  
//     const tasks = readData();  
//     const taskIndex = tasks.findIndex(t => t.id === req.params.id);  
//     if (taskIndex > -1) {  
//         tasks[taskIndex] = {  
//             id: tasks[taskIndex].id,  
//             name: req.body.name,  
//             mobile: req.body.mobile,  
//             email: req.body.email,  
//         };  
//         writeData(tasks);  
//     }  
//     res.redirect('/contact');  
// });  

  
  // Update a contact (handle form submission)  
//   app.post('/edit/:id', (req, res) => {  
//     const tasks = readData();  
//     const taskIndex = tasks.findIndex(t => t.id == req.params.id);  
//     if (taskIndex > -1) {  
//         tasks[taskIndex] = {  
//             id: tasks[taskIndex].id,  
//             name: req.body.name,  
//             mobile: req.body.mobile,  
//             email: req.body.email,  
//         };  
//         writeData(tasks);  
//     }  
//     res.redirect('/contact');  
//   });  
// // Edit a contact  
// app.get("/edit/:id", (req, res) => {  
//     const tasks = readData();  
//     const task = tasks.find((t) => t.id === req.params.id); // Compare as strings  
//     if (!task) {  
//         return res.status(404).send("Contact not found");  
//     }  
//     res.render('edit', { task, title: 'Edit Contact' });   
// });  

// // Update a contact (handle form submission)  
// app.post('/edit/:id', (req, res) => {  
//     const tasks = readData();  
//     const taskIndex = tasks.findIndex(t => t.id === req.params.id); // Compare as strings  
//     if (taskIndex > -1) {  
//         tasks[taskIndex] = {  
//             id: tasks[taskIndex].id,  
//             name: req.body.name,  
//             mobile: req.body.mobile,  
//             email: req.body.email,  
//         };  
//         writeData(tasks);  
//     }  
//     res.redirect('/contact');  
// });  


// Function to delete a task by ID  
function deleteTask(taskId) {  
    // Get the current list of tasks  
    let tasks = readData();  
    console.log("Tasks before deletion:", tasks); // Debugging: log tasks before deletion  

    // Filter out the task with the specified ID  
    tasks = tasks.filter((task) => task.id !== taskId); // Compare as strings  

    console.log("Tasks after filtering:", tasks); // Debugging: log tasks after filtering  

    // Write the updated tasks back to the data source  
    writeData(tasks);  
    console.log("Tasks written to file:", tasks); // Debugging: log tasks that are written to the file  
}


// Route to delete a task  
app.post('/delete/:id', (req, res) => {  
    const taskIdToDelete = req.params.id;  
    console.log("Deleting task with ID:", taskIdToDelete); // Debugging: log the ID being deleted  
    deleteTask(taskIdToDelete);  
    res.redirect('/contact');  
});

// 404 Error handling  
app.use((req, res) => {  
    res.status(404).send("404: Page not found!"); // Send a 404 response when no route matches the request  
});  

// Start the server and listen on the specified port  
const port = 3000;   
app.listen(port, () => {  
    console.log(`Server is running on port ${port}`); // Log a message indicating that the server is running  
});




