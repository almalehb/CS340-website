function fetchSupplierIngredients() {
    fetch('/api/supplierIngredients')
        .then(response => response.json())
        .then(supplierIngredients => renderSupplierIngredientsTable(supplierIngredients));
}

function renderSupplierIngredientsTable (supplierIngredients) {
    const tableBody = document.getElementById('table-data');
    tableBody.innerHTML = '';

    supplierIngredients.forEach((supplierIngredient) => {
        const row = tableBody.insertRow();
        const id = row.insertCell();
        const ingredientcell = row.insertCell();
        const supplierCell = row.insertCell();
        const operationsCell = row.insertCell();

        id.textContent = supplierIngredient.supplierIngredientId;
        ingredientcell.textContent =  supplierIngredient.ingredientName;
        supplierCell.textContent = supplierIngredient.supplierName;

        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.classList.add('edit-btn');
        editButton.addEventListener('click', () => editRow(row));

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', () => deleteItem(supplierIngredient.supplierIngredientId));

        operationsCell.appendChild(editButton);
        operationsCell.appendChild(deleteButton);
    })
}

fetchSupplierIngredients();

async function fetchOptions(url, selectElement, name, id) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        data.forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.value = option[id];
            optionElement.textContent = option[name];
            selectElement.appendChild(optionElement);
        });
    } catch (error) {
        console.error('Error fetching options:', error);
    }
}

fetchOptions('/api/ingredients', document.getElementById('ingredientId'), 'ingredientName', 'ingredientId');
fetchOptions('/api/suppliers', document.getElementById('supplierId'), 'supplierName', 'supplierId');


function addItem() {
    const ingredientInput = document.getElementById("ingredientId");
    const supplierInput = document.getElementById('supplierId');


    const data = `supplierId=${encodeURIComponent(supplierInput.value)}&ingredientId=${encodeURIComponent(
        ingredientInput.value)}`;

    fetch('/api/supplierIngredients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: data,
    })
        .then(response => {
            if (response.ok) {
                ingredientInput.value = '';
                supplierInput.value = '';

                fetchSupplierIngredients();
            } else {
                console.error('Error adding item:', response.statusText);
            }
        })
        .catch(error => console.error('Error adding item:', error));
}

document.querySelector('form').addEventListener('submit', (event) => {
    event.preventDefault();
    addItem()
});

function deleteItem(supplierIngredientId) {
    fetch(`/api/supplierIngredients/${supplierIngredientId}`, { method: "DELETE" })
      .then((response) => {
        if (response.ok) {
          fetchSupplierIngredients();
        } else {
          console.error("Error deleting item:", response.statusText);
        }
      })
      .catch((error) => console.error("Error deleting item:", error));
  }

function editItem(editedData) {
    const supplierIngredientId = editedData.supplierIngredientId;
    const data = `supplierId=${encodeURIComponent(editedData.supplierId)}&ingredientId=${encodeURIComponent(
        editedData.ingredientId)}`;
        fetch(`/api/supplierIngredients/${supplierIngredientId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: data
    })
        .then(response => {
            if (response.ok) {
                fetchSupplierIngredients();
            } else {
                console.error('Error updating item:', response.statusText);
            }
        })
        .catch(error => console.error('Error updating item:', error));
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
                    columnName = 'ingredientName';
                    id = 'ingredientId';
                    break;
                case 2:
                    attributeName = "suppliers";
                    columnName = 'supplierName';
                    id = 'supplierId';
                    break;
                default:
                    attributeName = ""; // Handle other cases if needed
            }
            const select = document.createElement("select");                
                const url = `/api/${attributeName}`
                fetchOptions(url, select, columnName, id);

                cell.innerHTML = originalContent;
                cell.appendChild(select);
        }
        editButton.textContent = "Confirm Edit";
    } else {
        const editedData = {
            supplierIngredientId: row.cells[0].textContent,
            ingredientId: row.cells[1].querySelector("select").value,
            supplierId: row.cells[2].querySelector("select").value,
        };
  
        editItem(editedData);
        editButton.textContent = "Edit";
    }
  }
  