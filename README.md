# Citation for the following code:
    {{!-- Create a table --}}
    <table>
    
        {{!-- Header section --}}
        <thead>
    
            {{!-- For just the first row, we print each key of the row object as a header cell so we
            know what each column means when the page renders --}}
            <tr>
                {{#each data.[0]}}
                <th>
                    {{@key}}
                </th>
                {{/each}}
            </tr>
        </thead>
    
        {{!-- Body section --}}
        <tbody>
    
            {{!-- For each row, print the id, fname, lname, homeworld and age, in order --}}
            {{#each data}}
            <tr>
                <td>{{this.id}}</td>
                <td>{{this.fname}}</td>
                <td>{{this.lname}}</td>
                <td>{{this.homeworld}}</td>
                <td>{{this.age}}</td>
            </tr>
            {{/each}}
        </tbody>
    </table>

    <!-- /views/index.hbs -->

    {{!-- Form to add a record to the table  --}}
    <h2>Adding Data with AJAX</h2>
    <p>To add a new person, please enter their information below and click 'Submit'!</p>
    <form id="add-person-form-ajax">
        <label for="input-fname">First Name: </label>
        <input type="text" name="input-fname" id="input-fname">
        
        <label for="input-lname">Last Name: </label>
        <input type="text" name="input-lname" id="input-lname">
    
        <label for="input-homeworld">Homeworld: </label>
        <input type="number" name="input-homeworld" id="input-homeworld">
    
        <label for="input-age">Age: </label>
        <input type="number" name="input-age" id="input-age">
    
        <input type="submit">
    </form>
    
    {{!-- Embed our javascript to handle the DOM manipulation and AJAX request --}}
    <script src="./js/add_person.js"></script>
# Date: 2/28/24
# Adapted from: George Kochera
# Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%204%20-%20Dynamically%20Displaying%20Data
# This code was adapted to our html pages including: deliveries.html, dishes.html, ingredients.html, menus.html, restaurants.html, suppliers.html, restaurantSuppliers.html, and supplierIngredients.html

# Citation for the following code:
    // Get the objects we need to modify
    let addPersonForm = document.getElementById('add-person-form-ajax');
    
    // Modify the objects we need
    addPersonForm.addEventListener("submit", function (e) {
        
        // Prevent the form from submitting
        e.preventDefault();
    
        // Get form fields we need to get data from
        let inputFirstName = document.getElementById("input-fname");
        let inputLastName = document.getElementById("input-lname");
        let inputHomeworld = document.getElementById("input-homeworld");
        let inputAge = document.getElementById("input-age");
    
        // Get the values from the form fields
        let firstNameValue = inputFirstName.value;
        let lastNameValue = inputLastName.value;
        let homeworldValue = inputHomeworld.value;
        let ageValue = inputAge.value;
    
        // Put our data we want to send in a javascript object
        let data = {
            fname: firstNameValue,
            lname: lastNameValue,
            homeworld: homeworldValue,
            age: ageValue
        }
        
        // Setup our AJAX request
        var xhttp = new XMLHttpRequest();
        xhttp.open("POST", "/add-person-ajax", true);
        xhttp.setRequestHeader("Content-type", "application/json");
    
        // Tell our AJAX request how to resolve
        xhttp.onreadystatechange = () => {
            if (xhttp.readyState == 4 && xhttp.status == 200) {
    
                // Add the new data to the table
                addRowToTable(xhttp.response);
    
                // Clear the input fields for another transaction
                inputFirstName.value = '';
                inputLastName.value = '';
                inputHomeworld.value = '';
                inputAge.value = '';
            }
            else if (xhttp.readyState == 4 && xhttp.status != 200) {
                console.log("There was an error with the input.")
            }
        }
    
        // Send the request and wait for the response
        xhttp.send(JSON.stringify(data));
    
    })
    
    
    // Creates a single row from an Object representing a single record from 
    // bsg_people
    addRowToTable = (data) => {
    
        // Get a reference to the current table on the page and clear it out.
        let currentTable = document.getElementById("people-table");
    
        // Get the location where we should insert the new row (end of table)
        let newRowIndex = currentTable.rows.length;
    
        // Get a reference to the new row from the database query (last object)
        let parsedData = JSON.parse(data);
        let newRow = parsedData[parsedData.length - 1]
    
        // Create a row and 4 cells
        let row = document.createElement("TR");
        let idCell = document.createElement("TD");
        let firstNameCell = document.createElement("TD");
        let lastNameCell = document.createElement("TD");
        let homeworldCell = document.createElement("TD");
        let ageCell = document.createElement("TD");
    
        // Fill the cells with correct data
        idCell.innerText = newRow.id;
        firstNameCell.innerText = newRow.fname;
        lastNameCell.innerText = newRow.lname;
        homeworldCell.innerText = newRow.homeworld;
        ageCell.innerText = newRow.age;
    
        // Add the cells to the row 
        row.appendChild(idCell);
        row.appendChild(firstNameCell);
        row.appendChild(lastNameCell);
        row.appendChild(homeworldCell);
        row.appendChild(ageCell);
        
        // Add the row to the table
        currentTable.appendChild(row);
    }
# Date: 2/29/24
# Adapted from: George Kochera
# Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%204%20-%20Dynamically%20Displaying%20Data
# This code was adapted to our JS pages including: deliveries.js, dishes.js, ingredients.js, menus.js, restaurants.js, suppliers.js, restaurantSuppliers.js, and supplierIngredients.js

# Citation for the following code:
    var mysql = require("mysql");

    // Create a 'connection pool' using the provided credentials
    var pool = mysql.createPool({
    connectionLimit: 10,
    host: "classmysql.engr.oregonstate.edu",
    user: "cs340_xxx",
    password: "xxxx",
    database: "cs340_xxx",
    });

    // Export it for use in our application
    module.exports.pool = pool;

    var express = require("express"); // We are using the express library for the web server
    var app = express(); // We need to instantiate an express object to interact with the server in our code
    PORT = 65412; // Set a port number at the top so it's easy to change in the future

    // Database
    var db = require("./db-connector");
    app.listen(PORT, function () {
    // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log(
        "Express started on http://localhost:" +
        PORT +
        "; press Ctrl-C to terminate."
    );
    });

# Date: 3/18/24
# Adapted from: CS340 starter code nodejs-starter-app
# Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app?tab=readme-ov-file
# This code was adapted to our JS pages including: app.js, db-connector.js
