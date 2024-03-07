/*
    SETUP for a simple web app
*/
// Express
var express = require('express');   // We are using the express library for the web server
var app = express();            // We need to instantiate an express object to interact with the server in our code
PORT = 65412;                 // Set a port number at the top so it's easy to change in the future

// Database
var db = require('./db-connector')

// body parser
app.use(express.urlencoded({ extended: true }));

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
app.listen(PORT, function () {            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});

// CRUD for Dishes
// READ 
app.get('/api/dishes', (req, res) => {
    const query = `
        SELECT Dishes.dishId, 
        Dishes.dishName,
        Ingredients.ingredientName AS 'main ingredient',
        Dishes.dishType
    FROM Dishes
    LEFT JOIN DishIngredients ON Dishes.dishId = DishIngredients.dishId
    LEFT JOIN Ingredients ON DishIngredients.ingredientId = Ingredients.ingredientId;
    `;
    // TODO: replace LEFT JOIN with INNER JOIN once we have the intersection table updating properly on insert

    db.pool.query(query, (err, results) => {
        if (err) {
            console.error("Error adding dish:", err);
            res.status(500).send("Error fetching dishes");
        } else {
            console.log('Dish fetched results', results);
            res.json(results);
        }
    });
});

// CREATE 
app.post('/api/dishes', (req, res) => {
    const dishName = req.body.name;
    const dishType = req.body.type;

    console.log('Received POST request to /api/dishes', req.body);
    console.log('dishName:', dishName);
    console.log('dishType:', dishType);

    db.pool.query('INSERT INTO Dishes (dishName, dishType) VALUES (?, ?)',
        [dishName, dishType],
        (err, result) => {
            if (err) {
                console.error("Error adding dish:", err);
                res.status(500).send("Error adding dish");
            } else {
                console.log('Dish added successfully with ID:', result.insertId);
                res.status(201).json({ dishId: result.insertId });
            }
        });
});

// UPDATE 
app.put('/api/dishes/:dishId', (req, res) => {
    const { dishId } = req.params;
    const { name: dishName, type: dishType } = req.body;

    const query = 'UPDATE Dishes SET dishName = ?, dishType = ? WHERE dishId = ?';
    db.pool.query(query, [dishName, dishType, dishId], (err, result) => {
        if (err) {
            console.error('Error updating dish:', err);
            res.status(500).send('Error updating dish');
        } else if (result.affectedRows === 0) {
            res.status(404).send('Dish not found');
        } else {
            console.log('Dish updated successfully');
            res.sendStatus(200);
        }
    });
});

// DELETE 
app.delete('/api/dishes/:dishId', (req, res) => {
    const { dishId } = req.params;

    db.pool.query('DELETE FROM Dishes WHERE dishId = ?', [dishId], (err, result) => {
        if (err) {
            res.status(500).send("Error deleting dish");
        } else if (result.affectedRows === 0) {
            res.status(404).send("Dish not found");
        } else {
            res.sendStatus(200);
        }
    });
});

// CRUD for Ingredients
// READ 
app.get('/api/ingredients', (req, res) => {
    const query = `
        SELECT Ingredients.ingredientId, 
               Ingredients.ingredientName,
               Ingredients.ingredientType,
               Ingredients.amountOrdered,
               Ingredients.totalCost
        FROM Ingredients 
    `;

    db.pool.query(query, (err, results) => {
        if (err) {
            console.error("Error fetching ingredients:", err);
            res.status(500).json({ error: "Error fetching ingredients from database" });
        } else {
            res.json(results);
        }
    });
});


// CREATE 
app.post('/api/ingredients', (req, res) => {
    const { ingredientName, ingredientType, amountOrdered, totalCost } = req.body;

    const query = 'INSERT INTO Ingredients (ingredientName, ingredientType, amountOrdered, totalCost) VALUES (?, ?, ?, ?)';
    db.pool.query(query, [ingredientName, ingredientType, amountOrdered, totalCost], (err, result) => {
        if (err) {
            console.error("Error adding ingredient:", err);
            res.status(500).json({ error: "Error adding ingredient to database" });
        } else {
            res.status(201).json({ ingredientId: result.insertId });
        }
    });
});

// UPDATE 
app.put('/api/ingredients/:ingredientId', (req, res) => {
    const { ingredientId } = req.params;
    const { name: ingredientName,
        type: ingredientType,
        amount: amountOrdered,
        cost: totalCost } = req.body;

    const query = 'UPDATE Ingredients SET ingredientName = ?, ingredientType = ?, amountOrdered = ?, totalCost = ? WHERE ingredientId = ?';
    db.pool.query(query, [ingredientName, ingredientType, amountOrdered, totalCost, ingredientId], (err, result) => {
        if (err) {
            console.error('Error updating ingredient:', err);
            res.status(500).json({ error: "Error updating ingredient in database" });
        } else if (result.affectedRows === 0) {
            res.status(404).send('Ingredient not found');
        } else {
            res.sendStatus(200);
        }
    });
});

// DELETE 
app.delete('/api/ingredients/:ingredientId', (req, res) => {
    const { ingredientId } = req.params;

    db.pool.query('DELETE FROM Ingredients WHERE ingredientId = ?', [ingredientId], (err, result) => {
        if (err) {
            console.error('Error deleting ingredient:', err);
            res.status(500).json({ error: "Error deleting ingredient from database" });
        } else if (result.affectedRows === 0) {
            res.status(404).send("Ingredient not found");
        } else {
            res.sendStatus(200);
        }
    });
}); 
