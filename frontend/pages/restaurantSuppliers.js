function fetchRestaurantSuppliers() {
  fetch("/api/restaurantSuppliers")
    .then((response) => response.json())
    .then((restaurantSuppliers) =>
      renderRestaurantSuppliersTable(restaurantSuppliers)
    );
}

function renderRestaurantSuppliersTable(restaurantSuppliers) {
  const tableBody = document.getElementById("restSupp-data");
  tableBody.innerHTML = "";

  restaurantSuppliers.forEach((restaurantSupplier) => {
    const row = tableBody.insertRow();
    const id = row.insertCell();
    const restaurantIdCell = row.insertCell();
    const locationCell = row.insertCell();
    const supplierIdCell = row.insertCell();
    const supplierNameCell = row.insertCell();
    const operationsCell = row.insertCell();

    id.textContent = restaurantSupplier.restaurantSupplierId;
    restaurantIdCell.textContent = restaurantSupplier.restaurantId;
    locationCell.textContent = restaurantSupplier.location;
    supplierIdCell.textContent = restaurantSupplier.supplierId;
    supplierNameCell.textContent = restaurantSupplier.supplierName;

    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.classList.add("edit-btn");
    // Pass the row to editRow function
    editButton.addEventListener("click", () => editRow(row));

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    // Use the correct function for deletion
    deleteButton.addEventListener("click", () =>
      deleteRestaurantSuppliers(restaurantSupplier.restaurantSupplierId)
    );

    operationsCell.appendChild(editButton);
    operationsCell.appendChild(deleteButton);
  });
}

fetchRestaurantSuppliers();

async function fetchOptions(url, selectElement, name, id) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    data.forEach((option) => {
      const optionElement = document.createElement("option");
      optionElement.value = option[id];
      optionElement.textContent = option[name];
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
  "restaurantId"
);

function addRestaurantSuppliers() {
  const restaurantIdInput = document.getElementById("restaurantId");
  const supplierIdInput = document.getElementById("supplierId");

  const data = `restaurantId=${encodeURIComponent(
    restaurantIdInput.value
  )}&supplierId=${encodeURIComponent(supplierIdInput.value)}`;

  fetch("/api/restaurantSuppliers", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: data,
  })
    .then((response) => {
      if (response.ok) {
        restaurantIdInput.value = "";
        supplierIdInput.value = "";
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
  const { restaurantSupplierId, restaurantId, supplierId } = editedData;
  const data = `restaurantId=${encodeURIComponent(
    restaurantId
  )}&supplierId=${encodeURIComponent(supplierId)}`;

  fetch(`/api/restaurantSuppliers/${restaurantSupplierId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: data,
  })
    .then((response) => {
      if (response.ok) {
        fetchRestaurantSuppliers(); // Refresh the list
      } else {
        console.error(
          "Error updating restaurantSuppliers intersection:",
          response.statusText
        );
      }
    })
    .catch((error) =>
      console.error("Error updating restaurantSuppliers intersection:", error)
    );
}

async function editRow(row) {
  const restaurantSupplierId = row.getAttribute("data-restaurant-supplier-id");
  const cells = row.querySelectorAll("td");
  const editButton = row.querySelector(".edit-btn");

  if (editButton.textContent === "Edit") {
    // Convert static text to dropdown for Restaurant ID and Supplier ID
    const restaurantSelect = document.createElement("select");
    await fetchOptions(
      "/api/restaurants",
      restaurantSelect,
      "location",
      "restaurantId"
    );
    cells[0].innerHTML = "";
    cells[0].appendChild(restaurantSelect);

    const supplierSelect = document.createElement("select");
    await fetchOptions(
      "/api/suppliers",
      supplierSelect,
      "supplierName",
      "supplierId"
    );
    cells[2].innerHTML = "";
    cells[2].appendChild(supplierSelect);

    editButton.textContent = "Confirm Edit";
  } else {
    // Collect edited data
    const editedData = {
      restaurantSupplierId: restaurantSupplierId, // Ensure this is correctly fetched and used
      restaurantId: cells[0].querySelector("select").value,
      supplierId: cells[2].querySelector("select").value,
    };

    editRestaurantSuppliers(editedData);
    editButton.textContent = "Edit";
  }
}

function deleteRestaurantSuppliers(restaurantSupplierId) {
  fetch(`/api/restaurantSuppliers/${restaurantSupplierId}`, {
    method: "DELETE",
  })
    .then((response) => {
      if (response.ok) {
        fetchRestaurantSuppliers();
      } else {
        console.error("Error deleting relationship:", response.statusText);
      }
    })
    .catch((error) =>
      console.error("Error deleting RestaurantSuppliers:", error)
    );
}
