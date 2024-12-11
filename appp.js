// Import modul
const express = require("express");  
const path = require('path');  
const ejsLayouts = require('express-ejs-layouts');  
const morgan = require("morgan");  
const { Pool } = require('pg'); // connector postgresql
const { body, validationResult } = require('express-validator');  

// buat instance express 
const app = express();  

// middleware 
app.use(express.urlencoded({ extended: true }));  
app.use(morgan("dev"));  

// Inisiasi view engine EJS 
app.set("view engine", "ejs");  
app.use(ejsLayouts);  
app.set("layout", "layouts/layout");  
app.use(express.static(path.join(__dirname, "public")));  

// setup connection postgresql
const pool = new Pool({  
    user:"postgres",
    password:"P4ssword",
    database:"postgres",
    host:"localhost",
    port:5432, // default PostgreSQL port  
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
app.get('/contact', async (req, res) => {  
    try {  
        const result = await pool.query('SELECT * FROM contact'); // Fetch existing contacts  
        res.render('contact', {  
            tasks: result.rows, // Pass existing contacts  
            errors: [], // Initialize errors as an empty array  
            title: 'Contact List' // Pass the title variable  
        });  
    } catch (error) {  
        console.error("Error fetching contacts:", error);  
        res.status(500).send("Internal Server Error");  
    }  
});  

// buat variabel validasi
const validationRules = [  
    body('name')  
        .isString().withMessage('Nama harus berupa huruf')  
        .isLength({ min: 3 }).withMessage('tidak boleh inisial, minimal 3 huruf')  
        .matches(/^[A-Za-z\s]+$/).withMessage('nama tidak boleh mengandung angka atau simbol'),  
    body('mobile')  
        .custom(value => {  
            const regex = /^(?:\+62|0)(\d{8,13})$/;  
            if (!regex.test(value)) {  
                throw new Error('masukkan nomor telepon Indonesia saja');  
            }  
            return true; // If validation passes  
        }),  
    body('email')  
        .isEmail().withMessage('format alamat email tidak sesuai')  
];  


// Add a new contact  
// app.post('/add', validationRules, async (req, res) => {  
//     const errors = validationResult(req);  
//     const { name, mobile, email } = req.body; 
//     const tasks = pool.query('select * from contact')
//     if (!errors.isEmpty()) {  
//         return res.render('contact', {  
//         tasks: await pool.query('INSERT INTO contact(name, mobile, email) VALUES (\$1, \$2, \$3) RETURNING *', [name, mobile, email]),
//         errors: errors.array(),  
//         formData: req.body,  
//         title: 'Contact List'  
//         });  
//         return res.status(400).json({ errors: errors.array() });  
//     } 
//     const duplicate = tasks.rows.find(task =>   
//         task.email === email ||   
//         task.mobile === mobile  
//     );  
//     if (duplicate) {  
//         return res.render('contact', {  
//         tasks,  
//         errors: [{ msg: 'A contact with this email or mobile number already exists.' }],  
//         formData: req.body,  
//         title: 'Contact List'});  
//         }  
      
//     // try {  
//     //     const result = await pool.query('INSERT INTO contact(name, mobile, email) VALUES (\$1, \$2, \$3) RETURNING *', [name, mobile, email]);  
//     //     res.status(201).json(result.rows[0]);
        
//     //     res.redirect('./contact'); 
//     // } catch (error) {  
//     //     console.error('Error inserting data:', error);  
//     //     res.status(500).json({ error: 'Internal Server Error' });  
//     // }  
// });  
// app.post('/add', validationRules, async (req, res) => {  
//     const errors = validationResult(req);  
//     const { name, mobile, email } = req.body;   

//     // Fetch existing contacts from the database  
//     const tasks = await pool.query('SELECT * FROM contact');  

//     // Check for validation errors  
//     if (!errors.isEmpty()) {  
//         return res.render('contact', {  
//             tasks: tasks.rows,  // Use tasks.rows to get the actual data  
//             errors: errors.array(),  
//             formData: req.body,  
//             title: 'Contact List'  
//         });  
//     }   

//     // Check for duplicate contacts  
//     const duplicate = tasks.rows.find(task =>   
//         task.email === email ||   
//         task.mobile === mobile  
//     );  

//     if (duplicate) {  
//         return res.render('contact', {  
//             tasks: tasks.rows,  
//             errors: [{ msg: 'A contact with this email or mobile number already exists.' }],  
//             formData: req.body,  
//             title: 'Contact List'  
//         });  
//     }  

//     // Insert new contact into the database  
//     const newContact = await pool.query('INSERT INTO contact(name, mobile, email) VALUES (\$1, \$2, \$3) RETURNING *', [name, mobile, email]);  

//     // Render the contact page with the updated list of contacts  
//     return res.render('contact', {  
//         tasks: [...tasks.rows, newContact.rows[0]],  // Include the newly added contact  
//         errors: [],  // No errors since the contact was added successfully  
//         formData: {},  // Clear form data after successful submission  
//         title: 'Contact List'  
//     });  
// });
app.post('/add', validationRules, async (req, res) => {  
    const errors = validationResult(req);  
    const { name, mobile, email } = req.body;   

    try {  
        // tarik seluruh (data) kontak yang ada di database
        const tasks = await pool.query('SELECT * FROM contact');  

        // melakukan validasi
        if (!errors.isEmpty()) {  
            return res.render('contact', {  
                tasks: tasks.rows,  // Use tasks.rows to get the actual data  
                errors: errors.array(),  
                formData: req.body,  
                title: 'Contact List'  
            });  
        }   

        // Check for duplicate contacts  
        const duplicate = tasks.rows.find(task =>   
            task.email === email ||   
            task.mobile === mobile  
        );  

        if (duplicate) {  
            return res.render('contact', {  
                tasks: tasks.rows,  
                errors: [{ msg: 'nomor telepon atau alamat email telah  terdaftar' }],  
                formData: req.body,  
                title: 'Contact List'  
            });  
        }  

        // masukkan kontak baru kedalam database
        const newContact = await pool.query('INSERT INTO contact(name, mobile, email) VALUES (\$1, \$2, \$3) RETURNING *', [name, mobile, email]);  

        // render halaman kontak dengan detail kontak yang baru
        return res.render('contact', {  
            tasks: [...tasks.rows, newContact.rows[0]],  // 
            errors: [],  
            formData: {},  
            title: 'Contact List'  
        });  

    } catch (error) {  
        console.error('error ketika memasukkan kontak', error);  

        // Render the contact page with an error message  
        return res.render('contact', {  
            tasks: [],  // Optionally, you can fetch tasks again if needed  
            errors: [{ msg: 'An error occurred while adding the contact. Please try again later.' }],  
            formData: req.body,  
            title: 'Contact List'  
        });  
    }  
});

// Route untuk menampilkan form edit 
app.get("/edit/:id", async (req, res) => {  
    try {  
        const result = await pool.query('SELECT * FROM contact WHERE id = \$1', [req.params.id]);  
        const task = result.rows[0];  
        if (!task) {  
            return res.status(404).send("Contact not found");  
        }  
        res.render('edit', { task, title: 'Edit Contact' });  
    } catch (error) {  
        console.error("Error fetching contact:", error);  
        res.status(500).send("Internal Server Error");  
    }  
});  

// fungsi utk mengupdate sebuah kontak 
app.post('/edit/:id', validationRules, async (req, res) => { 
    const errors = validationResult(req);   
    const { name, mobile, email } = req.body;  
    try {  
        if (!errors.isEmpty()) {  
            return res.render('contact', {  
                tasks: tasks.rows,  // Use tasks.rows to get the actual data  
                errors: errors.array(),  
                formData: req.body,  
                title: 'Contact List'  
            });  
        }   
        await pool.query('UPDATE contact SET name = \$1, mobile = \$2, email = \$3 WHERE id = \$4', [name, mobile, email, req.params.id]);  
        res.redirect('/contact');  
    } catch (error) {  
        return res.render('contact', {  
            tasks: [],  // Optionally, you can fetch tasks again if needed  
            errors: [{ msg: 'An error occurred while adding the contact. Please try again later.' }],  
            formData: req.body,  
            title: 'Contact List'  
        });  
    }  
    
});  

/// fungsi delete
app.post('/delete/:id', async (req, res) => {  
    try {  
        await pool.query('DELETE FROM contact WHERE id = \$1', [req.params.id]);  
        res.redirect('/contact');  
    } catch (error) {  
        console.error('Error deleting contact:', error);  
        res.status(500).send("Internal Server Error");  
    }  
});  
// 404 Error handling  
app.use((req, res) => {  
    res.status(404).send("404: Page not found!"); // Send a 404 response when no route matches the request  
});  

// Start the server and listen on the specified port  
const port = 3003;  
app.listen(port, () => {  
    console.log(`Server is running on port ${port}`); // Log a message indicating that the server is running  
});

