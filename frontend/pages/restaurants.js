function fetchRestaurants() {
  // fetching from the endpoint we defined in app.js
  fetch("/api/restaurants")
    .then((response) => response.json()) // convert to JSON
    .then((restaurants) => renderRestaurantsTable(restaurants)); // update the table
}

function renderRestaurantsTable(restaurants) {
  const restaurantsTableBody = document.querySelector("table tbody");
  restaurantsTableBody.innerHTML = ""; // let's empty existing rows

  restaurants.forEach((restaurant) => {
    const row = restaurantsTableBody.insertRow(); // new row for each restaurant
    const idCell = row.insertCell();
    // const sidCell = row.insertCell();
    const locationCell = row.insertCell();
    const managerCell = row.insertCell();
    const operationsCell = row.insertCell();

    // now we fill in the restaurant contents
    idCell.textContent = restaurant.restaurantId;
    // sidCell.textContent = restaurant.supplierId;
    locationCell.textContent = restaurant.location;
    managerCell.textContent = restaurant.managerName;

    // our edit button
    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.classList.add("edit-btn");
    editButton.addEventListener("click", () => editRow(row));

    // our delete button
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", () =>
      deleteRestaurant(restaurant.restaurantId)
    );

    operationsCell.appendChild(editButton);
    operationsCell.appendChild(deleteButton);
  });
}

function addRestaurant() {
  // get the relevant input fields from the DOM
  const locationInput = document.getElementById("location");
  const managerInput = document.getElementById("manager");

  // prepare data to be sent in POST request
  const data = `location=${encodeURIComponent(locationInput.value)}&manager=${encodeURIComponent(managerInput.value)}`;

  fetch("/api/restaurants", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: data,
  })
    .then((response) => {
      if (response.ok) {
        // handling successful addition
        locationInput.value = "";
        managerInput.value = "";
        // let's refresh the list to show the new value!
        fetchRestaurants();
      } else {
        console.error("Error adding restaurant:", response.statusText);
      }
    })
    .catch((error) => console.error("Error adding restaurant:", error));
}

function editRestaurant(editedData) {
  const restaurantId = editedData.restaurantId; // getting id from data

  const data = `location=${encodeURIComponent(
    editedData.location
  )}&manager=${encodeURIComponent(editedData.managerName)}`;

  fetch(`/api/restaurants/${restaurantId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: data,
  })
    .then((response) => {
      if (response.ok) {
        console.log("Restaurant updated successfully");
        // let's refresh the list to show the new value!
        fetchRestaurants();
      } else {
        console.error("Error updating restaurant:", response.statusText);
      }
    })
    .catch((error) => console.error("Error updating restaurant:", error));
}

function deleteRestaurant(restaurantId) {
  // the delete request takes a restaurant ID
  fetch(`/api/restaurants/${restaurantId}`, { method: "DELETE" })
    .then((response) => {
      if (response.ok) {
        // on successful deletion, refresh the list
        fetchRestaurants();
      } else {
        console.error("Error deleting restaurant:", response.statusText);
      }
    })
    .catch((error) => console.error("Error deleting restaurant:", error));
}

// calling fetchRestaurants to initially populate the table
fetchRestaurants();

// adding listener to the form
document.querySelector("form").addEventListener("submit", (event) => {
  event.preventDefault();
  addRestaurant();
});

function editRow(row) {
  const cells = row.querySelectorAll("td");
  const editButton = row.querySelector(".edit-btn");

  if (editButton.textContent === "Edit") {
    for (let i = 1; i < cells.length - 1; i++) {
      // skipping ID cell and button cell
      const cell = cells[i];
      const originalContent = cell.textContent;
      const inputType = i === 0 ? "number" : "text";
      cell.innerHTML = `<input type="${inputType}" value="${originalContent}" />`;
    }
    editButton.textContent = "Confirm Edit";
  } else {
    for (let i = 1; i < cells.length - 1; i++) {
      const cell = cells[i];
      const input = cell.querySelector("input");
      cell.textContent = input.value;
    }

    const editedData = {
      restaurantId: row.cells[0].textContent,
      location: row.cells[1].textContent,
      managerName: row.cells[2].textContent,
    };

    editRestaurant(editedData);

    editButton.textContent = "Edit";
  }
}
