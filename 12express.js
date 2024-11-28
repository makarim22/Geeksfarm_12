const express = require("express");
const fs = require('fs');
const app = express();
const path = require('path');  
const port = 3000;

//app.get("/", (req, res) => {
app.get('/', (req, res) => {  
    fs.readFile(path.join(__dirname, './views/index.html'), 'utf8', (err, data) => {  
        if (err) {  
            res.status(500).send('Error reading file');  
            return;  
            }  
        res.send(data);  
        });  
});
app.get('/about', (req, res) => {  
    fs.readFile(path.join(__dirname, './views/about.html'), 'utf8', (err, data) => {  
        if (err) {  
            res.status(500).send('Error reading file');  
            return;  
            }  
        res.send(data);  
        });  
});
app.get('/contact', (req, res) => {  
    fs.readFile(path.join(__dirname, './views/contact.html'), 'utf8', (err, data) => {  
        if (err) {  
            res.status(500).send('Error reading file');  
            return;  
            }  
        res.send(data);  
        });  
});

app.listen(port, () => {
    console.log(`server is running on port ${port}`);
})