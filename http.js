const http = require('http');
const fs = require('fs');
const port = 3000;

http.createServer((req, res)=>{
    const url = req.url;
    console.log(url);
    const renderHtml = (path, res) =>{
        res.writeHead(200, {"content-type" : "text-html"})
        fs.readFile( path, (err, data)=>{
            if (err) {
                console.log(err);
                res.write('error');
                res.end();
            } else {
                res.write(data);
                res.end();
            }
        })

    }
    if (url === "/about") {
        renderHtml("./views/about.html", res);
    } else if (url === "/contact"){
        renderHtml("./views/contact.html", res);    
    } else if (url === "/") {
        renderHtml("./views/index.html", res);
    }
    else {
        res.write("tidak ada");
        res.end();
    
}).listen(port, () =>{
    console.log(`Server is running on port ${port}`);
}); 