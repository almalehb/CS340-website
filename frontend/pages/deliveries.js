function fetchDeliveries() {
  fetch("/api/deliveries")
    .then((response) => response.json())
    .then((deliveries) => renderDeliveriesTable(deliveries));
}

function renderDeliveriesTable(deliveries) {
  // const tableBody = document.querySelector('table tbody');
  const tableBody = document.getElementById("deliveries-data");
  tableBody.innerHTML = "";

  deliveries.forEach((delivery) => {
    const row = tableBody.insertRow();
    const deliveryCell = row.insertCell();
    const ingredientcell = row.insertCell();
    const supplierCell = row.insertCell();
    const restaurantCell = row.insertCell();
    const deliveryDateCell = row.insertCell();
    const operationsCell = row.insertCell();

    deliveryCell.textContent = delivery.deliveryId;
    ingredientcell.textContent = delivery.ingredientName;
    supplierCell.textContent = delivery.supplierName;
    restaurantCell.textContent = delivery.restaurantId;
    const originalDate = delivery.deliveryDate;
    const formattedDate = formatDate(originalDate);
    deliveryDateCell.textContent = formattedDate;

    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.classList.add("edit-btn");
    editButton.addEventListener("click", () => editRow(row));

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", () =>
      deleteDelivery(delivery.deliveryId)
    );

    operationsCell.appendChild(editButton);
    operationsCell.appendChild(deleteButton);
  });
}

fetchDeliveries();

function formatDate(dateString) {
  const dateObj = new Date(dateString);
  return dateObj.toISOString().slice(0, 10);
}

async function fetchOption(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();
  } catch (error) {
    console.error("Error fetching options:", error);
  }
}

async function fetchOptions(url, selectElement, name, id) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    data.forEach((option) => {
      const optionElement = document.createElement("option");
      optionElement.value = option[id];
      optionElement.textContent = option[name]; // Assuming the property name holds the name of the entity
      selectElement.appendChild(optionElement);
    });
  } catch (error) {
    console.error("Error fetching options:", error);
  }
}

fetchOptions(
  "/api/ingredients",
  document.getElementById("ingredientId"),
  "ingredientName",
  "ingredientId"
);
fetchOptions(
  "/api/suppliers",
  document.getElementById("supplierId"),
  "supplierName",
  "supplierId"
);
fetchOptions(
  "/api/restaurants",
  document.getElementById("restaurantId"),
  "restaurantId",
  "restaurantId"
);

function addDelivery() {
  const ingredientInput = document.getElementById("ingredientId");
  const supplierInput = document.getElementById("supplierId");
  const restaurantInput = document.getElementById("restaurantId");
  const dateInput = document.getElementById("date");

  const data = `ingredientId=${encodeURIComponent(
    ingredientInput.value
  )}&supplierId=${encodeURIComponent(
    supplierInput.value
  )}&restaurantId=${encodeURIComponent(
    restaurantInput.value
  )}&deliveryDate=${encodeURIComponent(dateInput.value)}`;

  fetch("/api/deliveries", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: data,
  })
    .then((response) => {
      if (response.ok) {
        ingredientInput.value = "";
        supplierInput.value = "";
        restaurantInput.value = "";
        dateInput.value = "";
        fetchDeliveries();
      } else {
        console.error("Error adding delivery:", response.statusText);
      }
    })
    .catch((error) => console.error("Error adding delivery:", error));
}

document.querySelector("form").addEventListener("submit", (event) => {
  event.preventDefault();
  addDelivery();
});

function editDelivery(editedData) {
  const deliveryId = editedData.deliveryId;
  const data = `ingredientId=${encodeURIComponent(
    editedData.ingredientId
  )}&supplierId=${encodeURIComponent(
    editedData.supplierId
  )}&restaurantId=${encodeURIComponent(
    editedData.restaurantId
  )}&deliveryDate=${encodeURIComponent(editedData.deliveryDate)}`;
  fetch(`/api/deliveries/${deliveryId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: data,
  })
    .then((response) => {
      if (response.ok) {
        fetchDeliveries();
      } else {
        console.error("Error updating delivery:", response.statusText);
      }
    })
    .catch((error) => console.error("Error updating delivery:", error));
}

async function editRow(row) {
  const cells = row.querySelectorAll("td");
  const editButton = row.querySelector(".edit-btn");

  if (editButton.textContent === "Edit") {
    for (let i = 1; i < cells.length - 1; i++) {
      // skipping ID cell and button cell
      const cell = cells[i];
      const originalContent = cell.textContent;

      let attributeName, columnName, id;
      switch (i) {
        case 1:
          attributeName = "ingredients";
          columnName = "ingredientName";
          id = "ingredientId";
          break;
        case 2:
          attributeName = "suppliers";
          columnName = "supplierName";
          id = "supplierId";
          break;
        case 3:
          attributeName = "restaurants";
          columnName = "restaurantId";
          id = "restaurantId";
          break;
        case 4:
          attributeName = "deliveryDate";

          break;
        default:
          attributeName = ""; // Handle other cases if needed
      }
      if (attributeName !== "deliveryDate") {
        // Fetch options for the dropdown
        const select = document.createElement("select");
        const url = `/api/${attributeName}`;
        fetchOptions(url, select, columnName, id);

        cell.innerHTML = originalContent;
        cell.appendChild(select);
      } else {
        // deliverydate
        cell.innerHTML = `<input type='date' value='${cell.textContent}' required/>`;
      }
    }
    editButton.textContent = "Confirm Edit";
  } else {
    const editedData = {
      deliveryId: row.cells[0].textContent,
      ingredientId: row.cells[1].querySelector("select").value,
      supplierId: row.cells[2].querySelector("select").value,
      restaurantId: row.cells[3].querySelector("select").value,
      deliveryDate: row.cells[4].querySelector("input").value,
    };

    editDelivery(editedData);
    editButton.textContent = "Edit";
  }
}

function deleteDelivery(deliveryId) {
  fetch(`/api/deliveries/${deliveryId}`, { method: "DELETE" })
    .then((response) => {
      if (response.ok) {
        fetchDeliveries();
      } else {
        console.error("Error deleting delivery:", response.statusText);
      }
    })
    .catch((error) => console.error("Error deleting delivery:", error));
}
