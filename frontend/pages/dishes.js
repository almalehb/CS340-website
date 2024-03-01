
function fetchDishes() {
    fetch('/api/dishes')
        .then(response => response.json())
        .then(dishes => renderDishesTable(dishes));
}

function renderDishesTable(dishes) {
    const dishesTableBody = document.querySelector('table tbody');
    dishesTableBody.innerHTML = ''; // let's empty existing rows

    dishes.forEach(dish => {
        const row = dishesTableBody.insertRow();
        const idCell = row.insertCell();
        const nameCell = row.insertCell();
        const typeCell = row.insertCell();
        const operationsCell = row.insertCell();

        idCell.textContent = dish.dishId;
        nameCell.textContent = dish.dishName;
        typeCell.textContent = dish.dishType;

        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.addEventListener('click', () => editDish(dish.dishId));

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', () => deleteDish(dish.dishId));

        operationsCell.appendChild(editButton);
        operationsCell.appendChild(deleteButton);
    });
}



function addDish() {
    const nameInput = document.getElementById('name');
    const typeInput = document.getElementById('type');

    const data = `name=${encodeURIComponent(nameInput.value)}&type=${encodeURIComponent(typeInput.value)}`;

    fetch('/api/dishes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: data
    })
        .then(response => {
            if (response.ok) {
                nameInput.value = '';
                typeInput.value = '';
                fetchDishes();
            } else {
                console.error('Error adding dish:', response.statusText);
            }
        })
        .catch(error => console.error('Error adding dish:', error));
}



function editDish(dishId) {
    // TODO
}

function deleteDish(dishId) {
    fetch(`/api/dishes/${dishId}`, { method: 'DELETE' })
        .then(response => {
            if (response.ok) {
                fetchDishes();
            } else {
                console.error('Error deleting dish:', response.statusText);
            }
        })
        .catch(error => console.error('Error deleting dish:', error));
}

// calling fetchDishes to initially populate the table
fetchDishes();

// adding listener
document.querySelector('form').addEventListener('submit', (event) => {
    event.preventDefault();
    addDish();
});

