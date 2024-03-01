
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

        // our edit button (not yet functional)
        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.addEventListener('click', () => editDish(dish.dishId));

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



function editDish(dishId) {
    // TODO: implement edit functionality
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

