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
        .isLength({ min: 3 }).withMessage('nama tidak boleh inisial, minimal 3 huruf')  
        .matches(/^[A-Za-z\s]+$/).withMessage('nama tidak boleh mengandung angka atau simbol'),  
    body('mobile')
        .isMobilePhone('id-ID').withMessage('format nomor telepon salah')  
        ,  
    body('email')  
        .isEmail().withMessage('format alamat email tidak sesuai')  
];  


app.post('/add', validationRules, async (req, res) => {  
    const errors = validationResult(req);  
    const { name, mobile, email } = req.body;   

    try {  
        // tarik seluruh (data) kontak yang ada di database
        const tasks = await pool.query('SELECT * FROM contact');  

        // melakukan validasi
        if (!errors.isEmpty()) {  
            return res.render('contact', {  
                tasks: tasks.rows,  // gunakan tasks.rows untuk mendapatkan data aktual 
                errors: errors.array(),  
                formData: req.body,  
                title: 'Contact List'  
            });  
        }   

        // fungsi utk mengecek data duplikat pada var mobile dan email
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
            tasks: [...tasks.rows,  newContact.rows[0]],  // 
            errors: [],  
            formData: {},  
            title: 'Contact List'  
        });  

    } catch (error) {  
        console.error('error ketika memasukkan kontak', error);  

        // Render halaman kontak dengan menampilkan pesan error 
        return res.render('contact', {  
            tasks: [],  // Optionally, you can fetch tasks again if needed  
            errors: [{ msg: 'Error terjadi ketika memasukkan kontak, periksa apakah nama, nomor telepon, dan alamat email sesuai format yang diminta' }],  
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
    const tasks = await pool.query('SELECT * FROM contact');  
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
            tasks: tasks.rows,  // Optionally, you can fetch tasks again if needed  
            errors: [{ msg: 'Error terjadi ketika memasukkan kontak, periksa apakah nama, nomor telepon, dan alamat email sesuai format yang diminta' }],  
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
    res.status(404).send("404: Page not found!")
}); // response yag diberikan ketika route tidak didefinisikan

// jalankan server pada port tertentu 
const port = 3000;  
app.listen(port, () => {  
    console.log(`Server is running on port ${port}`); 
});