
function fetchDishes() {
    // fetching from the endpoint we defined in app.js
    fetch('/api/dishes')
        .then(response => response.json()) // convert to JSON
        .then(dishes => renderDishesTable(dishes)); // update the table
}

function renderDishesTable(dishes) {
    const dishesTableBody = document.querySelector('table tbody');
    dishesTableBody.innerHTML = ''; // let's empty existing rows

    dishes.forEach(dish => {
        const row = dishesTableBody.insertRow(); // new row for each dish
        const idCell = row.insertCell();
        const nameCell = row.insertCell();
        const typeCell = row.insertCell();
        const operationsCell = row.insertCell();

        // now we fill in the dish contents
        idCell.textContent = dish.dishId;
        nameCell.textContent = dish.dishName;
        typeCell.textContent = dish.dishType;

        // our edit button
        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.classList.add('edit-btn');
        editButton.addEventListener('click', () => editRow(row));

        // our delete button
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', () => deleteDish(dish.dishId));

        operationsCell.appendChild(editButton);
        operationsCell.appendChild(deleteButton);
    });
}



function addDish() {
    // get the relevant input fields from the DOM
    const nameInput = document.getElementById('name');
    const typeInput = document.getElementById('type');

    // prepare data to be sent in POST request
    const data = `name=${encodeURIComponent(nameInput.value)}&type=${encodeURIComponent(typeInput.value)}`;

    fetch('/api/dishes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: data
    })
        .then(response => {
            if (response.ok) {
                // handling successful addition
                nameInput.value = '';
                typeInput.value = '';
                // let's refresh the list to show the new value!
                fetchDishes();
            } else {
                console.error('Error adding dish:', response.statusText);
            }
        })
        .catch(error => console.error('Error adding dish:', error));
}

function editDish(editedData) {
    const dishId = editedData.dishId; // getting id from data

    const data = `name=${encodeURIComponent(editedData.dishName)}&type=${encodeURIComponent(editedData.dishType)}`;

    fetch(`/api/dishes/${dishId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: data
    })
        .then(response => {
            if (response.ok) {
                console.log('Dish updated successfully');
                // let's refresh the list to show the new value!
                fetchDishes();
            } else {
                console.error('Error updating dish:', response.statusText);
            }
        })
        .catch(error => console.error('Error updating dish:', error));
}

function deleteDish(dishId) {
    // the delete request takes a dish ID
    fetch(`/api/dishes/${dishId}`, { method: 'DELETE' })
        .then(response => {
            if (response.ok) {
                // on successful deletion, refersh the list
                fetchDishes();
            } else {
                console.error('Error deleting dish:', response.statusText);
            }
        })
        .catch(error => console.error('Error deleting dish:', error));
}

// calling fetchDishes to initially populate the table
fetchDishes();

// adding listener to the form
document.querySelector('form').addEventListener('submit', (event) => {
    event.preventDefault();
    addDish();
});

function editRow(row) {
    const cells = row.querySelectorAll('td.editable');
    const editButton = row.querySelector('.edit-btn');

    if (editButton.textContent === 'Edit') {
        cells.forEach(cell => {
            const originalContent = cell.textContent;
            const inputType = cell.dataset.label === 'ID' ? 'number' : 'text'; 

            cell.innerHTML = `<input type="${inputType}" value="${originalContent}" />`;
        });
        editButton.textContent = 'Confirm Edit';
    } else {
        cells.forEach(cell => {
            const input = cell.querySelector('input');
            cell.textContent = input.value; 
            // Update: Collect data to send to editDish
            const editedData = { 
                dishId: row.cells[0].textContent, // Assuming ID is in the first cell 
                // ... gather other edited data similarly 
            };
            editDish(editedData); // Pass data to your editDish function
        });
        editButton.textContent = 'Edit'; 
    }
}
