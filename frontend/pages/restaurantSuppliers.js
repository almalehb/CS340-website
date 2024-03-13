function fetchRestaurantSuppliers() {
  fetch("/api/restaurantSuppliers")
    .then((response) => response.json())
    .then((restaurantSuppliers) =>
      renderRestaurantSuppliersTable(restaurantSuppliers)
    );
}

function renderRestaurantSuppliersTable(restaurantSuppliers) {
  // const tableBody = document.querySelector('table tbody');
  const tableBody = document.getElementById("restSupp-data");
  tableBody.innerHTML = "";

  restaurantSuppliers.forEach((restaurantSupplier) => {
    const row = tableBody.insertRow();
    const restSuppCell = row.insertCell();
    const restaurantIdCell = row.insertCell();
    const locationCell = row.insertCell();
    const supplierIdCell = row.insertCell();
    const supplierNameCell = row.insertCell();
    const operationsCell = row.insertCell();

    restSuppCell.textContent = restaurantSupplier.restaurantSupplierId;
    restaurantIdCell.textContent = restaurantSupplier.restaurantId;
    locationCell.textContent = restaurantSupplier.location;
    supplierIdCell.textContent = restaurantSupplier.supplierId;
    supplierNameCell.textContent = restaurantSupplier.supplierName;

    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.classList.add("edit-btn");
    editButton.addEventListener("click", () => editRow(row));

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", () =>
      deleteRestaurantSuppliers(restaurantSupplier.restaurantSupplierId)
    );

    operationsCell.appendChild(editButton);
    operationsCell.appendChild(deleteButton);
  });
}

fetchRestaurantSuppliers();

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
  "/api/suppliers",
  document.getElementById("supplierId"),
  "supplierName",
  "supplierId"
);
fetchOptions(
  "/api/restaurants",
  document.getElementById("restaurantId"),
  "restaurantId",
  "location"
);

function addRestaurantSuppliers() {
  const restaurantIdInput = document.getElementById("restaurantId");
  // const locationInput = document.getElementById("location");
  const supplierIdInput = document.getElementById("supplierId");
  // const supplierNameInput = document.getElementById("supplierName");

  const data = `restaurantId=${encodeURIComponent(restaurantIdInput.value)}&
  )}&supplierId=${encodeURIComponent(supplierIdInput.value)}`;

  fetch("/api/restaurantSuppliers", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: data,
  })
    .then((response) => {
      if (response.ok) {
        restaurantIdInput.value = "";
        // locationInput.value = "";
        supplierIdInput.value = "";
        // supplierNameInput.value = "";
        fetchRestaurantSuppliers();
      } else {
        console.error(
          "Error adding restaurantSuppliers intersection:",
          response.statusText
        );
      }
    })
    .catch((error) => console.error("Error adding intersection:", error));
}

document.querySelector("form").addEventListener("submit", (event) => {
  event.preventDefault();
  addRestaurantSuppliers();
});

function editRestaurantSuppliers(editedData) {
  const deliveryId = editedData.restaurantSupplierId;
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

// async function editRow(row) {
//   const cells = row.querySelectorAll("td");
//   const editButton = row.querySelector(".edit-btn");

//   if (editButton.textContent === "Edit") {
//     for (let i = 1; i < cells.length - 1; i++) {
//       // skipping ID cell and button cell
//       const cell = cells[i];
//       const originalContent = cell.textContent;

//       let attributeName, columnName, id;
//       switch (i) {
//         case 1:
//           attributeName = "ingredients";
//           columnName = "ingredientName";
//           id = "ingredientId";
//           break;
//         case 2:
//           attributeName = "suppliers";
//           columnName = "supplierName";
//           id = "supplierId";
//           break;
//         case 3:
//           attributeName = "restaurants";
//           columnName = "restaurantId";
//           id = "restaurantId";
//           break;
//         case 4:
//           attributeName = "deliveryDate";

//           break;
//         default:
//           attributeName = ""; // Handle other cases if needed
//       }
//       if (attributeName !== "deliveryDate") {
//         // Fetch options for the dropdown
//         const select = document.createElement("select");
//         const url = `/api/${attributeName}`;
//         fetchOptions(url, select, columnName, id);

//         cell.innerHTML = originalContent;
//         cell.appendChild(select);
//       } else {
//         // deliverydate
//         cell.innerHTML = `<input type='date' value='${cell.textContent}' required/>`;
//       }
//     }
//     editButton.textContent = "Confirm Edit";
//   } else {
//     const editedData = {
//       deliveryId: row.cells[0].textContent,
//       ingredientId: row.cells[1].querySelector("select").value,
//       supplierId: row.cells[2].querySelector("select").value,
//       restaurantId: row.cells[3].querySelector("select").value,
//       deliveryDate: row.cells[4].querySelector("input").value,
//     };

//     editDelivery(editedData);
//     editButton.textContent = "Edit";
//   }
// }

// function deleteDelivery(deliveryId) {
//   fetch(`/api/deliveries/${deliveryId}`, { method: "DELETE" })
//     .then((response) => {
//       if (response.ok) {
//         fetchDeliveries();
//       } else {
//         console.error("Error deleting delivery:", response.statusText);
//       }
//     })
//     .catch((error) => console.error("Error deleting delivery:", error));
// }
