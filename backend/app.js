/*
    SETUP for a simple web app (as part of Activity 2)
*/
// Express
var express = require('express');   // We are using the express library for the web server
var app     = express();            // We need to instantiate an express object to interact with the server in our code
PORT        = 65412;                 // Set a port number at the top so it's easy to change in the future

// Database
var db = require('./db-connector')

const path = require('path'); 

// Serve static files from the frontend directory
app.use(express.static(path.join(__dirname, '../frontend')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend/index.html')); 
});

app.get('/deliveries', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend/pages/deliveries.html'));
});

app.get('/dishes', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend/pages/dishes.html'));
});

app.get('/ingredients', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend/pages/ingredients.html'));
});

app.get('/menus', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend/pages/menus.html'));
});

app.get('/restaurants', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend/pages/restaurants.html'));
});

app.get('/suppliers', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend/pages/suppliers.html'));
});

/*
    LISTENER
*/
app.listen(PORT, function(){            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});