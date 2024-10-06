const http = require("http");
const fs = require("fs");
const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res, next) => {
    fs.readFile("username.txt", (err, data) => {
        if (err) {
            console.log(err);
            data = "NO chat Exist";
        }
        res.send(`
            ${data}
            <form action="/" method="POST" onsubmit="document.getElementById('username').value = localStorage.getItem('username')">
                <input id="message" type="text" name="message" placeholder="Type your message...">
                <input id="username" type="hidden" name="username">
                <button type="submit">Send</button>
            </form>
        `);
    });
});

app.post("/", (req, res, next) => {
    console.log(req.body.username);
    console.log(req.body.message);
    
    // Append the message with the username
    fs.writeFile("username.txt", `${req.body.username}: ${req.body.message}\n`, { flag: 'a' }, (err) => {
        if (err) {
            console.log(err);
        }
        res.redirect("/");
    });
});

app.get("/login", (req, res, next) => {
    res.send(`
        <form onsubmit="localStorage.setItem('username', document.getElementById('username').value)" action="/login" method="POST">
            <input id="username" type="text" name="username" placeholder="Enter your username" required>
            <button type="submit">Login</button>
        </form>
    `);
});

// Route to handle the login POST request
app.post("/login", (req, res, next) => {
    // Redirect to the root URL after setting local storage
    res.redirect("/");
});

const server = http.createServer(app);
server.listen(4000, () => {
    console.log("Server is running on http://localhost:4000");
});
