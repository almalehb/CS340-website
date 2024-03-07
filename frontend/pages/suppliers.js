fetchSuppliers();

function fetchSuppliers() {
  fetch("/api/suppliers")
    .then((response) => response.json())
    .then((suppliers) => renderSuppliersTable(suppliers));
}

function renderSuppliersTable(suppliers) {
  const suppliersTableBody = document.querySelector("table tbody");
  suppliersTableBody.innerHTML = "";

  suppliers.forEach((supplier) => {
    const row = suppliersTableBody.insertRow();
    const idCell = row.insertCell();
    const supplierNameCell = row.insertCell();
    const contactCell = row.insertCell();
    const specialtyCell = row.insertCell();
    const operationsCell = row.insertCell();

    idCell.textContent = supplier.supplierId;
    supplierNameCell.textContent = supplier.supplierName;
    contactCell.textContent = supplier.contactInfo;
    specialtyCell.textContent = supplier.specialty;

    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.classList.add("edit-btn");
    editButton.addEventListener("click", () => editRow(row, supplier));

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", () =>
      deleteSupplier(supplier.supplierId)
    );

    operationsCell.appendChild(editButton);
    operationsCell.appendChild(deleteButton);
  });
}

function addSupplier() {
  const supplierNameInput = document.getElementById("supplierName");
  const contactInfoInput = document.getElementById("contactInfo");
  const specialtyInput = document.getElementById("specialty");

  const data = `supplierName=${encodeURIComponent(
    supplierNameInput.value
  )}&contactInfo=${encodeURIComponent(
    contactInfoInput.value
  )}&specialty=${encodeURIComponent(specialtyInput.value)}`;

  fetch("/api/suppliers", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: data,
  })
    .then((response) => {
      if (response.ok) {
        supplierNameInput.value = "";
        contactInfoInput.value = "";
        specialtyInput.value = "";
        fetchSuppliers();
      } else {
        console.error("Error adding supplier:", response.statusText);
      }
    })
    .catch((error) => console.error("Error adding supplier:", error));
}

// adding listener to the form
document.querySelector("form").addEventListener("submit", (event) => {
  event.preventDefault();
  addSupplier();
});

function editSupplier(editedData) {
  const supplierId = editedData.supplierId;

  const data = `supplierName=${encodeURIComponent(
    editedData.supplierName
  )}&contactInfo=${encodeURIComponent(
    editedData.contactInfo
  )}&specialty=${encodeURIComponent(editedData.specialty)}`;

  fetch(`/api/suppliers/${supplierId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: data,
  })
    .then((response) => {
      if (response.ok) {
        console.log("Supplier updated successfully");
        fetchSuppliers();
      } else {
        console.error("Error updating supplier:", response.statusText);
      }
    })
    .catch((error) => console.error("Error updating supplier:", error));
}

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
      supplierId: row.cells[0].textContent,
      supplierName: row.cells[1].textContent,
      contactInfo: row.cells[2].textContent,
      specialty: row.cells[3].textContent,
    };

    editSupplier(editedData);

    editButton.textContent = "Edit";
  }
}

function deleteSupplier(supplierId) {
  fetch(`/api/suppliers/${supplierId}`, { method: "DELETE" })
    .then((response) => {
      if (response.ok) {
        fetchSuppliers();
      } else {
        console.error("Error deleting supplier:", response.statusText);
      }
    })
    .catch((error) => console.error("Error deleting supplier:", error));
}
