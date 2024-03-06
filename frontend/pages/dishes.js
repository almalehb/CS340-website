function fetchDishes() {
  // fetching from the endpoint we defined in app.js
  fetch("/api/dishes")
    .then((response) => response.json()) // convert to JSON
    .then((dishes) => renderDishesTable(dishes)); // update the table
}

function renderDishesTable(dishes) {
  const dishesTableBody = document.querySelector("table tbody");
  dishesTableBody.innerHTML = ""; // Clear existing rows

  dishes.forEach((dish) => {
    const row = dishesTableBody.insertRow();
    row.setAttribute("data-dish-id", dish.dishId); // Set unique identifier

    const idCell = row.insertCell();
    idCell.textContent = dish.dishId;

    const nameCell = row.insertCell();
    nameCell.textContent = dish.dishName;

    const typeCell = row.insertCell();
    typeCell.textContent = dish.dishType;

    const operationsCell = row.insertCell();

    // Edit button
    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.onclick = function () {
      editDish(dish.dishId);
    }; // Assign edit handler
    operationsCell.appendChild(editButton);

    // Delete button
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.onclick = function () {
      deleteDish(dish.dishId);
    }; // Assign delete handler
    operationsCell.appendChild(deleteButton);
  });
}

function addDish() {
  // get the relevant input fields from the DOM
  const nameInput = document.getElementById("name");
  const typeInput = document.getElementById("type");

  // prepare data to be sent in POST request
  const data = `name=${encodeURIComponent(
    nameInput.value
  )}&type=${encodeURIComponent(typeInput.value)}`;

  fetch("/api/dishes", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: data,
  })
    .then((response) => {
      if (response.ok) {
        // handling successful addition
        nameInput.value = "";
        typeInput.value = "";
        // let's refresh the list to show the new value!
        fetchDishes();
      } else {
        console.error("Error adding dish:", response.statusText);
      }
    })
    .catch((error) => console.error("Error adding dish:", error));
}

function editDish(dishId) {
  const dishRow = document.querySelector(`tr[data-dish-id="${dishId}"]`);
  const nameCell = dishRow.cells[1];
  const typeCell = dishRow.cells[2];
  const operationsCell = dishRow.cells[3];

  // Clear current cells
  nameCell.innerHTML = "";
  typeCell.innerHTML = "";
  operationsCell.innerHTML = "";

  // Create and append the name input
  const nameInput = document.createElement("input");
  nameInput.type = "text";
  nameInput.value = dishRow.querySelector("td:nth-child(2)").textContent;
  nameInput.id = `edit-name-${dishId}`;
  nameCell.appendChild(nameInput);

  // Create and append the type input
  const typeInput = document.createElement("input");
  typeInput.type = "text";
  typeInput.value = dishRow.querySelector("td:nth-child(3)").textContent;
  typeInput.id = `edit-type-${dishId}`;
  typeCell.appendChild(typeInput);

  // Create and append the save button
  const saveButton = document.createElement("button");
  saveButton.textContent = "Save";
  saveButton.addEventListener("click", function () {
    saveDish(dishId);
  });
  operationsCell.appendChild(saveButton);
}

function saveDish(dishId) {
  const nameInput = document.getElementById(`edit-name-${dishId}`);
  const typeInput = document.getElementById(`edit-type-${dishId}`);

  if (!nameInput || !typeInput) {
    console.error("Cannot find input fields for dish:", dishId);
    return;
  }

  const data = JSON.stringify({
    name: nameInput.value,
    type: typeInput.value,
  });

  fetch(`/api/dishes/${dishId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: data,
  })
    .then((response) => {
      if (response.ok) {
        fetchDishes(); // Refresh the dishes list
      } else {
        response.json().then((data) => {
          console.error("Error updating dish:", data.message);
        });
      }
    })
    .catch((error) => console.error("Error updating dish:", error));
}

function deleteDish(dishId) {
  // the delete request takes a dish ID
  fetch(`/api/dishes/${dishId}`, { method: "DELETE" })
    .then((response) => {
      if (response.ok) {
        // on successful deletion, refersh the list
        fetchDishes();
      } else {
        console.error("Error deleting dish:", response.statusText);
      }
    })
    .catch((error) => console.error("Error deleting dish:", error));
}

// calling fetchDishes to initially populate the table
fetchDishes();

// adding listener to the form
document.querySelector("form").addEventListener("submit", (event) => {
  event.preventDefault();
  addDish();
});
