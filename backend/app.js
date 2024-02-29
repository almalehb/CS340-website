/*
    SETUP for a simple web app (as part of Activity 2)
*/
// Express
var express = require('express');   // We are using the express library for the web server
var app     = express();            // We need to instantiate an express object to interact with the server in our code
PORT        = 65412;                 // Set a port number at the top so it's easy to change in the future

// Database
var db = require('./db-connector')


// Serve static files from the frontend directory
app.use(express.static(path.join(__dirname, 'frontend')));


/*
    ROUTES
*/
app.get('/', function(req, res)
    {
        res.sendFile(path.join(__dirname, 'frontend/pages/index.html'));
    });

/*
    LISTENER
*/
app.listen(PORT, function(){            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});