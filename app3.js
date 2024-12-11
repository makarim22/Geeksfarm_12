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

app.get('/contact', (req, res) => {  
    const tasks = readData(); // Get existing contacts  
    res.render('contact', {  
        tasks, // Pass existing contacts  
        errors: [], // Initialize errors as an empty array  
        title: 'Contact List' // Pass the title variable  
    });  
});

const validationRules = [  
    body('name')  
        .isString().withMessage('Name must be a string')  
        .isLength({ min: 3 }).withMessage('Name must be at least 3 characters long')  
        .matches(/^[A-Za-z\s]+$/).withMessage('Name must contain only letters and spaces'), // Regex to allow only letters and spaces   
    body('mobile')  
        .custom(value => {  
        // Regex to validate Indonesian mobile phone numbers  
        const regex = /^(?:\+62|0)(\d{8,13})$/;  
        if (!regex.test(value)) {  
            throw new Error('Must be a valid Indonesian mobile phone number');  
        }  
        return true; // If validation passes  
    }),
    body('email')  
        .isEmail().withMessage('Must be a valid email address')
];  

///
app.post('/add', validationRules, async (req, res) => {  
    // Check for validation errors  
    const errors = validationResult(req);  
    if (!errors.isEmpty()) {  
        return res.status(400).json({ errors: errors.array() });  
    }  

    const { name, mobile, email } = req.body;  
    try {  
        const result = await pool.query('INSERT INTO contact(name, mobile, email) VALUES (\$1, \$2, \$3) RETURNING *', [name, mobile, email]);  
        res.status(201).json(result.rows[0]);  
    } catch (error) {  
        console.error('Error inserting data:', error);  
        res.status(500).json({ error: 'Internal Server Error' });  
    }  
});  
///

///
// app.post('/add', validationRules, (req, res) => {  
//     const errors = validationResult(req);  
//     if (!errors.isEmpty()) {  
//         return res.render('contact', {  
//             tasks: readData(),  
//             errors: errors.array(),  
//             formData: req.body,  
//             title: 'Contact List'  
//         });  
//     }  

//     // Read existing contacts  
//     const tasks = readData();  

//     // Check for duplicates  
//     const duplicate = tasks.find(task =>   
//         task.email === req.body.email ||   
//         task.mobile === req.body.mobile  
//     );  

    if (duplicate) {  
        return res.render('contact', {  
            tasks,  
            errors: [{ msg: 'A contact with this email or mobile number already exists.' }],  
            formData: req.body,  
            title: 'Contact List'});  
    }  

//     // If validation passes and no duplicates, proceed to add the contact  
//     tasks.push({  
//         id: Date.now().toString(),  
//         name: req.body.name,  
//         mobile: req.body.mobile,  
//         email: req.body.email  
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
const port = 3002;   
app.listen(port, () => {  
    console.log(`Server is running on port ${port}`); // Log a message indicating that the server is running  
});


