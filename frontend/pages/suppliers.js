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
    const nameCell = row.insertCell();
    const contactCell = row.insertCell();
    const specialtyCell = row.insertCell();
    const operationsCell = row.insertCell();

    idCell.textContent = supplier.supplierId;
    nameCell.textContent = supplier.suppName;
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
  const suppNameInput = document.getElementById("suppName");
  const contactInfoInput = document.getElementById("contactInfo");
  const specialtyInput = document.getElementById("specialty");

  const data = `suppName=${encodeURIComponent(
    suppNameInput.value
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
        suppNameInput.value = "";
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

  const data = `suppName=${encodeURIComponent(
    editedData.suppName
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
  const supplierId = cells[0].textContent;

  if (editButton.textContent === "Edit") {
    cells[1].innerHTML = `<input type='text' value='${cells[1].textContent}' />`;
    cells[2].innerHTML = `<input type='text' value='${cells[2].textContent}' />`;
    cells[3].innerHTML = `<input type='text' value='${cells[3].textContent}' />`;
    editButton.textContent = "Confirm Edit";
  } else {
    const editedData = {
      suppName: cells[1].querySelector("input").value,
      contactInfo: cells[2].querySelector("input").value,
      specialty: cells[3].querySelector("input").value,
    };

    editSupplier(supplierId, editedData);
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
