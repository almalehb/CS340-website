/*
    SETUP for a simple web app
*/
// Express
var express = require("express"); // We are using the express library for the web server
var app = express(); // We need to instantiate an express object to interact with the server in our code
PORT = 65412; // Set a port number at the top so it's easy to change in the future

// Database
var db = require("./db-connector");

// body parser
app.use(express.urlencoded({ extended: true }));

const path = require("path");

// Serve static files from the frontend directory
app.use(express.static(path.join(__dirname, "../frontend")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend/index.html"));
});

app.get("/deliveries", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend/pages/deliveries.html"));
});

app.get("/dishes", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend/pages/dishes.html"));
});

app.get("/ingredients", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend/pages/ingredients.html"));
});

app.get("/menus", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend/pages/menus.html"));
});

app.get("/restaurants", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend/pages/restaurants.html"));
});

app.get("/suppliers", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend/pages/suppliers.html"));
});

app.get("/supplierIngredients", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend/pages/supplierIngredients.html"));
});

/*
    LISTENER
*/
app.listen(PORT, function () {
  // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
  console.log(
    "Express started on http://localhost:" +
      PORT +
      "; press Ctrl-C to terminate."
  );
});

// CRUD for Restaurants ----------------------------------------------------------------------------------------
// READ
app.get("/api/restaurants", (req, res) => {
  const query = `
      SELECT Restaurants.restaurantId, 
        Restaurants.location, 
        Restaurants.managerName 
      FROM Restaurants
    `;

  db.pool.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching restaurants:", err);
      res
        .status(500)
        .json({ error: "Error fetching restaurants from database" });
    } else {
      res.json(results);
    }
  });
});

// CREATE
app.post("/api/restaurants", (req, res) => {
  const location = req.body.location;
  const managerName = req.body.manager;

  console.log("Received POST request to /api/restaurants", req.body);
  console.log("location:", location);
  console.log("managerName:", managerName);

  db.pool.query(
    "INSERT INTO Restaurants (location, managerName) VALUES (?, ?)",
    [location, managerName],
    (err, result) => {
      if (err) {
        console.error("Error adding restaurant from app.js:", err);
        res.status(500).send("Error adding restaurant from app.js");
      } else {
        console.log("Restaurant added successfully with ID:", result.insertId);
        res.status(201).json({ restaurantId: result.insertId });
      }
    }
  );
});

// UPDATE
app.put("/api/restaurants/:restaurantId", (req, res) => {
  const { restaurantId } = req.params;
  const { location: location, manager: managerName } = req.body;

  const query =
    "UPDATE Restaurants SET location = ?, managerName = ? WHERE restaurantId = ?";
  db.pool.query(query, [location, managerName, restaurantId], (err, result) => {
    if (err) {
      console.error("Error updating restaurant:", err);
      res.status(500).json({ error: "Error updating restaurant in database" });
    } else if (result.affectedRows === 0) {
      res.status(404).send("Restaurant not found");
    } else {
      res.sendStatus(200);
    }
  });
});

// DELETE
app.delete("/api/restaurants/:restaurantId", (req, res) => {
  const { restaurantId } = req.params;

  db.pool.query(
    "DELETE FROM Restaurants WHERE restaurantId = ?",
    [restaurantId],
    (err, result) => {
      if (err) {
        console.error("Error deleting restaurant:", err);
        res
          .status(500)
          .json({ error: "Error deleting restaurant from database" });
      } else if (result.affectedRows === 0) {
        res.status(404).send("Restaurant not found");
      } else {
        res.sendStatus(200);
      }
    }
  );
});

// CRUD for Dishes ---------------------------------------------------------------------------------------------
// READ
app.get("/api/dishes", (req, res) => {
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
      console.log("Dish fetched results", results);
      res.json(results);
    }
  });
});

// CREATE
app.post("/api/dishes", (req, res) => {
  const dishName = req.body.name;
  const dishType = req.body.type;

  console.log("Received POST request to /api/dishes", req.body);
  console.log("dishName:", dishName);
  console.log("dishType:", dishType);

  db.pool.query(
    "INSERT INTO Dishes (dishName, dishType) VALUES (?, ?)",
    [dishName, dishType],
    (err, result) => {
      if (err) {
        console.error("Error adding dish:", err);
        res.status(500).send("Error adding dish");
      } else {
        console.log("Dish added successfully with ID:", result.insertId);
        res.status(201).json({ dishId: result.insertId });
      }
    }
  );
});

// UPDATE
app.put("/api/dishes/:dishId", (req, res) => {
  const { dishId } = req.params;
  const { name: dishName, type: dishType } = req.body;

  const query = "UPDATE Dishes SET dishName = ?, dishType = ? WHERE dishId = ?";
  db.pool.query(query, [dishName, dishType, dishId], (err, result) => {
    if (err) {
      console.error("Error updating dish:", err);
      res.status(500).send("Error updating dish");
    } else if (result.affectedRows === 0) {
      res.status(404).send("Dish not found");
    } else {
      console.log("Dish updated successfully");
      res.sendStatus(200);
    }
  });
});

// DELETE
app.delete("/api/dishes/:dishId", (req, res) => {
  const { dishId } = req.params;

  db.pool.query(
    "DELETE FROM Dishes WHERE dishId = ?",
    [dishId],
    (err, result) => {
      if (err) {
        res.status(500).send("Error deleting dish");
      } else if (result.affectedRows === 0) {
        res.status(404).send("Dish not found");
      } else {
        res.sendStatus(200);
      }
    }
  );
});

// CRUD for Ingredients ----------------------------------------------------------------------------------------
// READ
app.get("/api/ingredients", (req, res) => {
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
      res
        .status(500)
        .json({ error: "Error fetching ingredients from database" });
    } else {
      res.json(results);
    }
  });
});

// CREATE
app.post("/api/ingredients", (req, res) => {
  const {
    name: ingredientName,
    type: ingredientType,
    amount: amountOrdered,
    cost: totalCost,
  } = req.body;
  const query =
    "INSERT INTO Ingredients (ingredientName, ingredientType, amountOrdered, totalCost) VALUES (?, ?, ?, ?)";
  db.pool.query(
    query,
    [ingredientName, ingredientType, amountOrdered, totalCost],
    (err, result) => {
      if (err) {
        console.error("Error adding ingredient:", err);
        res.status(500).json({ error: "Error adding ingredient to database" });
      } else {
        res.status(201).json({ ingredientId: result.insertId });
      }
    }
  );
});

// UPDATE
app.put("/api/ingredients/:ingredientId", (req, res) => {
  const { ingredientId } = req.params;
  const {
    name: ingredientName,
    type: ingredientType,
    amount: amountOrdered,
    cost: totalCost,
  } = req.body;

  const query =
    "UPDATE Ingredients SET ingredientName = ?, ingredientType = ?, amountOrdered = ?, totalCost = ? WHERE ingredientId = ?";
  db.pool.query(
    query,
    [ingredientName, ingredientType, amountOrdered, totalCost, ingredientId],
    (err, result) => {
      if (err) {
        console.error("Error updating ingredient:", err);
        res
          .status(500)
          .json({ error: "Error updating ingredient in database" });
      } else if (result.affectedRows === 0) {
        res.status(404).send("Ingredient not found");
      } else {
        res.sendStatus(200);
      }
    }
  );
});

// DELETE
app.delete("/api/ingredients/:ingredientId", (req, res) => {
  const { ingredientId } = req.params;

  db.pool.query(
    "DELETE FROM Ingredients WHERE ingredientId = ?",
    [ingredientId],
    (err, result) => {
      if (err) {
        console.error("Error deleting ingredient:", err);
        res
          .status(500)
          .json({ error: "Error deleting ingredient from database" });
      } else if (result.affectedRows === 0) {
        res.status(404).send("Ingredient not found");
      } else {
        res.sendStatus(200);
      }
    }
  );
});

// CRUD for Menus -------------------------------------------------------------------------------------------
// READ - Get all menus
app.get("/api/menus", (req, res) => {
  const query = ` SELECT * FROM Menus `;
  db.pool.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching menus:", err);
      res.status(500).json({ error: "Error fetching menus from database" });
    } else {
      res.json(results);
    }
  });
});

// CREATE - Create a new menu
app.post("/api/menus", (req, res) => {
  const { restaurantId, menuType, dateUpdated } = req.body;
  console.log(req.body);
  const query =
    "INSERT INTO Menus (restaurantId, menuType, dateUpdated) VALUES (?, ?, ?)";
  db.pool.query(query, [restaurantId, menuType, dateUpdated], (err, result) => {
    if (err) {
      console.error("Error adding menu:", err);
      res.status(500).json({ error: "Error adding menu to database" });
    } else {
      res.status(201).json({ menuId: result.insertId });
    }
  });
});

// UPDATE - Update an existing menu
app.put("/api/menus/:menuId", (req, res) => {
  const { menuId } = req.params;
  const { restaurantId, menuType, dateUpdated } = req.body;
  console.log(req.body);
  const query =
    "UPDATE Menus SET restaurantId = ?, menuType = ?, dateUpdated = ? WHERE menuId = ?";
  db.pool.query(
    query,
    [restaurantId, menuType, dateUpdated, menuId],
    (err, result) => {
      if (err) {
        console.error("Error updating menu:", err);
        res.status(500).json({ error: "Error updating menu in database" });
      } else if (result.affectedRows === 0) {
        res.status(404).send("Menu not found");
      } else {
        res.sendStatus(200);
      }
    }
  );
});

// DELETE - Delete a menu
app.delete("/api/menus/:menuId", (req, res) => {
  const { menuId } = req.params;
  db.pool.query(
    "DELETE FROM Menus WHERE menuId = ?",
    [menuId],
    (err, result) => {
      if (err) {
        console.error("Error deleting menu:", err);
        res.status(500).json({ error: "Error deleting menu from database" });
      } else if (result.affectedRows === 0) {
        res.status(404).send("Menu not found");
      } else {
        res.sendStatus(200);
      }
    }
  );
});

// CRUD for Suppliers ----------------------------------------------------------------------------------------
// READ
app.get("/api/suppliers", (req, res) => {
  const query = `
      SELECT Suppliers.supplierId,
        Suppliers.supplierName, 
        Suppliers.contactInfo,
        Suppliers.specialty 
      FROM Suppliers
    `;

  db.pool.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching suppliers:", err);
      res.status(500).json({ error: "Error fetching suppliers from database" });
    } else {
      res.json(results);
    }
  });
});

// CREATE
app.post("/api/suppliers", (req, res) => {
  const supplierName = req.body.supplierName;
  const contactInfo = req.body.contactInfo;
  const specialty = req.body.specialty;

  console.log("Received POST request to /api/suppliers", req.body);
  console.log("supplierName:", supplierName);
  console.log("contactInfo:", contactInfo);
  console.log("specialty:", specialty);

  db.pool.query(
    "INSERT INTO Suppliers (supplierName, contactInfo, specialty) VALUES (?, ?, ?)",
    [supplierName, contactInfo, specialty],
    (err, result) => {
      if (err) {
        console.error("Error adding supplier from app.js:", err);
        res.status(500).send("Error adding supplier from app.js");
      } else {
        console.log("Supplier added successfully with ID:", result.insertId);
        res.status(201).json({ supplierId: result.insertId });
      }
    }
  );
});

// UPDATE
app.put("/api/suppliers/:supplierId", (req, res) => {
  const { supplierId } = req.params;
  const {
    supplierName: supplierName,
    contactInfo: contactInfo,
    specialty: specialty,
  } = req.body;

  const query =
    "UPDATE Suppliers SET supplierName = ?, contactInfo = ?, specialty = ? WHERE supplierId = ?";
  db.pool.query(
    query,
    [supplierName, contactInfo, specialty, supplierId],
    (err, result) => {
      if (err) {
        console.error("Error updating supplier:", err);
        res.status(500).json({ error: "Error updating supplier in database" });
      } else if (result.affectedRows === 0) {
        res.status(404).send("Supplier not found");
      } else {
        res.sendStatus(200);
      }
    }
  );
});

// DELETE
app.delete("/api/suppliers/:supplierId", (req, res) => {
  const { supplierId } = req.params;

  db.pool.query(
    "DELETE FROM Suppliers WHERE supplierId = ?",
    [supplierId],
    (err, result) => {
      if (err) {
        console.error("Error deleting supplier:", err);
        res
          .status(500)
          .json({ error: "Error deleting supplier from database" });
      } else if (result.affectedRows === 0) {
        res.status(404).send("Supplier not found");
      } else {
        res.sendStatus(200);
      }
    }
  );
});

// CRUD for Deliveries ---------------------------------------------------------------------------------------------
// READ
app.get("/api/deliveries", (req, res) => {
  const query = `
      SELECT Deliveries.deliveryId, Deliveries.deliveryDate, 
             Ingredients.ingredientName, Suppliers.supplierName, Restaurants.restaurantId
      FROM Deliveries
      INNER JOIN Ingredients ON Deliveries.ingredientId = Ingredients.ingredientId
      INNER JOIN Suppliers ON Deliveries.supplierId = Suppliers.supplierId
      INNER JOIN Restaurants ON Deliveries.restaurantId = Restaurants.restaurantId
  `;

  db.pool.query(query, (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).send("Error fetching data");
      return;
    }
    console.log("deliveries fetched results", results);
    res.json(results);
  });
});

// CREATE
app.post("/api/deliveries", (req, res) => {
  const ingredientId = req.body.ingredientId;
  const supplierId = req.body.supplierId;
  const restaurantId = req.body.restaurantId;
  const deliveryDate = req.body.deliveryDate;

  console.log("Received POST request to /api/deliveries", req.body);
  console.log("ingredientId:", ingredientId);
  console.log("supplierId:", supplierId);
  console.log("restaurantId:", restaurantId);
  console.log("deliveryDate:", deliveryDate);

  const query =
    "INSERT INTO Deliveries (ingredientId, supplierId, restaurantId, deliveryDate) VALUES (?, ?, ?, ?)";
  db.pool.query(
    query,
    [ingredientId, supplierId, restaurantId, deliveryDate],
    (err, result) => {
      if (err) {
        console.error("Error adding delivery from app.js:", err);
        res.status(500).send("Error adding delivery from app.js");
      } else {
        console.log("delivery added successfully with ID:", result.insertId);
        res.status(201).json({ deliveryId: result.insertId });
      }
    }
  );
});

// UPDATE
app.put("/api/deliveries/:deliveryId", (req, res) => {
  const { deliveryId } = req.params;
  const { ingredientId, supplierId, restaurantId, deliveryDate } = req.body;
  console.log(req.body);
  const query =
    "UPDATE Deliveries SET ingredientId = ?, supplierId = ?, restaurantId = ?, deliveryDate = ? WHERE deliveryId = ?";
  db.pool.query(
    query,
    [ingredientId, supplierId, restaurantId, deliveryDate, deliveryId],
    (err, result) => {
      if (err) {
        console.error("Error updating delivery:", err);
        res.status(500).json({ error: "Error updating delivery in database" });
      } else if (result.affectedRows === 0) {
        res.status(404).send("Delivery not found");
      } else {
        res.sendStatus(200);
      }
    }
  );
});

// DELETE
app.delete("/api/deliveries/:deliveryId", (req, res) => {
  const { deliveryId } = req.params;

  db.pool.query(
    "DELETE FROM Deliveries WHERE deliveryId = ?",
    [deliveryId],
    (err, result) => {
      if (err) {
        console.error("Error deleting delivery:", err);
        res
          .status(500)
          .json({ error: "Error deleting delivery from database" });
      } else if (result.affectedRows === 0) {
        res.status(404).send("Delivery not found");
      } else {
        res.sendStatus(200);
      }
    }
  );
});

// CRUD for supplierIngredients ----------------------------------------------------------------------------------------
//READ
app.get("/api/supplierIngredients", (req, res) => {
  const query = `
      SELECT SupplierIngredients.supplierIngredientId, Suppliers.supplierName, Ingredients.ingredientName
      FROM SupplierIngredients
      INNER JOIN Suppliers ON SupplierIngredients.supplierId = Suppliers.supplierId
      INNER JOIN Ingredients ON SupplierIngredients.ingredientId = Ingredients.ingredientId 

  `;

  db.pool.query(query, (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).send("Error fetching data");
      return;
    }
    console.log("deliveries fetched results", results);
    res.json(results);
  });
});

// CREATE
app.post("/api/supplierIngredients", (req, res) => {
  const ingredientId = req.body.ingredientId;
  const supplierId = req.body.supplierId;

  console.log("Received POST request to /api/supplierIngredients", req.body);
  console.log("ingredientId:", ingredientId);
  console.log("supplierId:", supplierId);

  const query =
    "INSERT INTO SupplierIngredients (supplierId, ingredientId) VALUES (?, ?)";
  db.pool.query(query, [supplierId, ingredientId], (err, result) => {
    if (err) {
      console.error("Error adding item from app.js:", err);
      res.status(500).send("Error adding item from app.js");
    } else {
      console.log("item added successfully with ID:", result.insertId);
      res.status(201).json({ deliveryId: result.insertId });
    }
  });
});

// UPDATE
app.put("/api/supplierIngredients/:supplierIngredientId", (req, res) => {
  const { supplierIngredientId } = req.params;
  const { ingredientId, supplierId } = req.body;
  console.log(req.body);
  const query =
    "UPDATE SupplierIngredients SET supplierId = ?, ingredientId = ? WHERE supplierIngredientId = ?";
  db.pool.query(
    query,
    [supplierId, ingredientId, supplierIngredientId],
    (err, result) => {
      if (err) {
        console.error("Error updating item:", err);
        res.status(500).json({ error: "Error updating item in database" });
      } else if (result.affectedRows === 0) {
        res.status(404).send("Item not found");
      } else {
        res.sendStatus(200);
      }
    }
  );
});

// DELETE
app.delete("/api/supplierIngredients/:supplierIngredientId", (req, res) => {
  const { supplierIngredientId } = req.params;

  db.pool.query(
    "DELETE FROM SupplierIngredients WHERE supplierIngredientId = ?",
    [supplierIngredientId],
    (err, result) => {
      if (err) {
        console.error("Error deleting:", err);
        res.status(500).json({ error: "Error deleting from database" });
      } else if (result.affectedRows === 0) {
        res.status(404).send("Id not found");
      } else {
        res.sendStatus(200);
      }
    }
  );
});

// CRUD for RestaurantSuppliers ---------------------------------------------------------------------------------------------
// READ
app.get("/api/restaurantSuppliers", (req, res) => {
  const query = `
      SELECT 
        RestaurantSuppliers.restaurantId,
        Restaurants.location,
        RestaurantSuppliers.supplierId,
        Suppliers.supplierName
      FROM 
        RestaurantSuppliers
      INNER JOIN 
        Suppliers ON RestaurantSuppliers.supplierId = Suppliers.supplierId
      INNER JOIN 
        Restaurants ON RestaurantSuppliers.restaurantId = Restaurants.restaurantId
      ORDER BY 
        RestaurantSuppliers.restaurantId, RestaurantSuppliers.supplierId
  `;

  db.pool.query(query, (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).send("Error fetching data");
      return;
    }
    console.log("restaurantSuppliers fetched results", results);
    res.json(results);
  });
});

// CREATE
app.post("/api/restaurantSuppliers", (req, res) => {
  const restaurantId = req.body.restaurantId;
  const supplierId = req.body.supplierId;

  console.log("Received POST request to /api/restaurantSuppliers", req.body);
  console.log("restaurantId:", restaurantId);
  console.log("supplierId:", supplierId);

  const query =
    "INSERT INTO RestaurantSuppliers (restaurantId, supplierId) VALUES (?, ?)";
  db.pool.query(query, [restaurantId, supplierId], (err, result) => {
    if (err) {
      console.error(
        "Error adding restaurantSuppliers intersection from app.js:",
        err
      );
      res
        .status(500)
        .send("Error adding restaurantSuppliers intersection from app.js");
    } else {
      console.log(
        "restaurantSuppliers relationship added successfully with ID:",
        result.insertId
      );
      res.status(201).json({ restaurantSupplierId: result.insertId });
    }
  });
});

// UPDATE
app.put("/api/restaurantSuppliers/:restaurantSupplierId", (req, res) => {
  const { restaurantSupplierId } = req.params;
  const { restaurantId, supplierId } = req.body;
  console.log(req.body);
  const query =
    "UPDATE RestaurantSuppliers SET restaurantId = ?, supplierId = ? WHERE restaurantSupplierId = ?";
  db.pool.query(
    query,
    [restaurantId, supplierId, restaurantSupplierId],
    (err, result) => {
      if (err) {
        console.error("Error updating restaurantSuppliers intersection:", err);
        res.status(500).json({
          error: "Error updating restaurantSuppliers intersection in database",
        });
      } else if (result.affectedRows === 0) {
        res.status(404).send("Intersection not found");
      } else {
        res.sendStatus(200);
      }
    }
  );
});

// DELETE
app.delete("/api/restaurantSuppliers/:restaurantSupplierId", (req, res) => {
  const { restaurantSupplierId } = req.params;

  db.pool.query(
    "DELETE FROM RestaurantSuppliers WHERE restaurantSupplierId = ?",
    [restaurantSupplierId],
    (err, result) => {
      if (err) {
        console.error("Error deleting relation:", err);
        res.status(500).json({ error: "Error deleting from database" });
      } else if (result.affectedRows === 0) {
        res.status(404).send("Id not found");
      } else {
        res.sendStatus(200);
      }
    }
  );
});


// CRUD for DishIngredients 

app.get("/api/DishesIngredients", async (req, res) => {
  const query = `
      SELECT d.dishId, d.dishName, d.dishType, i.ingredientId, i.ingredientName, i.ingredientType
      FROM Dishes d
      JOIN DishIngredients di ON d.dishId = di.dishId
      JOIN Ingredients i ON di.ingredientId = i.ingredientId
      ORDER BY d.dishId, i.ingredientId;
  `;

  db.pool.query(query, (err, results) => {
    if (err) {
        console.error("Error fetching DishIngredients:", err);
        return res.status(500).send("Error");
    }

    const dishes = results.reduce((acc, current) => {
        const { dishId, dishName, dishType, ingredientId, ingredientName, ingredientType } = current;
        if (!acc[dishId]) {
            acc[dishId] = {
                dishId,
                dishName,
                dishType,
                ingredients: []
            };
        }
        acc[dishId].ingredients.push({ ingredientId, ingredientName, ingredientType });
        return acc;
    }, {});

    res.json(Object.values(dishes));
  });
});
