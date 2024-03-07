function fetchIngredients() {
  fetch("/api/ingredients")
    .then((response) => response.json())
    .then((ingredients) => renderIngredientsTable(ingredients));
}

function renderIngredientsTable(ingredients) {
  const ingredientsTableBody = document.querySelector("table tbody");
  ingredientsTableBody.innerHTML = "";

  ingredients.forEach((ingredient) => {
    const row = ingredientsTableBody.insertRow();
    const idCell = row.insertCell();
    const nameCell = row.insertCell();
    const typeCell = row.insertCell();
    const amountCell = row.insertCell();
    const costCell = row.insertCell();
    const operationsCell = row.insertCell();

    idCell.textContent = ingredient.ingredientId;
    nameCell.textContent = ingredient.ingredientName;
    typeCell.textContent = ingredient.ingredientType;
    amountCell.textContent = ingredient.amountOrdered;
    costCell.textContent = ingredient.totalCost;

    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.classList.add("edit-btn");
    editButton.addEventListener("click", () => editRow(row));

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", () =>
      deleteIngredient(ingredient.ingredientId)
    );

    operationsCell.appendChild(editButton);
    operationsCell.appendChild(deleteButton);
  });
}

function addIngredient() {
  const nameInput = document.getElementById("name");
  const typeInput = document.getElementById("type");
  const amountInput = document.getElementById("amount");
  const costInput = document.getElementById("cost");

  const data = `name=${encodeURIComponent(
    nameInput.value
  )}&type=${encodeURIComponent(typeInput.value)}&amount=${encodeURIComponent(
    amountInput.value
  )}&cost=${encodeURIComponent(costInput.value)}`;

  fetch("/api/ingredients", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: data,
  })
    .then((response) => {
      if (response.ok) {
        nameInput.value = "";
        typeInput.value = "";
        amountInput.value = "";
        costInput.value = "";
        fetchIngredients();
      } else {
        console.error("Error adding ingredient:", response.statusText);
      }
    })
    .catch((error) => console.error("Error adding ingredient:", error));
}

function editIngredient(editedData) {
  const ingredientId = editedData.ingredientId;

  const data = `name=${encodeURIComponent(
    editedData.ingredientName
  )}&type=${encodeURIComponent(
    editedData.ingredientType
  )}&amount=${encodeURIComponent(
    editedData.amountOrdered
  )}&cost=${encodeURIComponent(editedData.totalCost)}`;

  fetch(`/api/ingredients/${ingredientId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: data,
  })
    .then((response) => {
      console.log(response);
      if (response.ok) {
        fetchIngredients();
      } else {
        console.error("Error updating ingredient:", response.statusText);
      }
    })
    .catch((error) => console.error("Error updating ingredient:", error));
}

function deleteIngredient(ingredientId) {
  fetch(`/api/ingredients/${ingredientId}`, { method: "DELETE" })
    .then((response) => {
      if (response.ok) {
        fetchIngredients();
      } else {
        console.error("Error deleting ingredient:", response.statusText);
      }
    })
    .catch((error) => console.error("Error deleting ingredient:", error));
}

function editRow(row) {
  const cells = row.querySelectorAll("td");
  const editButton = row.querySelector(".edit-btn");

  if (editButton.textContent === "Edit") {
    // switching to edit mode
    for (let i = 1; i < cells.length - 1; i++) {
      const cell = cells[i];
      const originalContent = cell.textContent;
      const inputType = i === 3 ? "number" : "text";
      cell.innerHTML = `<input type="${inputType}" value="${originalContent}" />`;
    }
    editButton.textContent = "Confirm Edit";
  } else {
    const editedData = {
      ingredientId: cells[0].textContent,
      ingredientName: cells[1].querySelector("input").value,
      ingredientType: cells[2].querySelector("input").value,
      amountOrdered: parseFloat(cells[3].querySelector("input").value),
      totalCost: cells[4].querySelector("input").value
        ? parseFloat(cells[4].querySelector("input").value)
        : null,
    };

    cells[1].textContent = editedData.ingredientName;
    cells[2].textContent = editedData.ingredientType;
    cells[3].textContent = editedData.amountOrdered;
    cells[4].textContent =
      editedData.totalCost === null ? "" : editedData.totalCost.toFixed(2);

    editIngredient(editedData);

    editButton.textContent = "Edit";
  }
}

fetchIngredients();

function fetchIngredients() {
  fetch("/api/ingredients")
    .then((response) => response.json())
    .then((ingredients) => renderIngredientsTable(ingredients));
}

function renderIngredientsTable(ingredients) {
  const ingredientsTableBody = document.querySelector("table tbody");
  ingredientsTableBody.innerHTML = "";

  ingredients.forEach((ingredient) => {
    const row = ingredientsTableBody.insertRow();
    const idCell = row.insertCell();
    const nameCell = row.insertCell();
    const typeCell = row.insertCell();
    const amountCell = row.insertCell();
    const costCell = row.insertCell();
    const operationsCell = row.insertCell();

    idCell.textContent = ingredient.ingredientId;
    nameCell.textContent = ingredient.ingredientName;
    typeCell.textContent = ingredient.ingredientType;
    amountCell.textContent = ingredient.amountOrdered;
    costCell.textContent = ingredient.totalCost;

    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.classList.add("edit-btn");
    editButton.addEventListener("click", () => editRow(row));

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", () =>
      deleteIngredient(ingredient.ingredientId)
    );

    operationsCell.appendChild(editButton);
    operationsCell.appendChild(deleteButton);
  });
}

function addIngredient() {
  const nameInput = document.getElementById("name");
  const typeInput = document.getElementById("type");
  const amountInput = document.getElementById("amount");
  const costInput = document.getElementById("cost");

  const data = `name=${encodeURIComponent(
    nameInput.value
  )}&type=${encodeURIComponent(typeInput.value)}&amount=${encodeURIComponent(
    amountInput.value
  )}&cost=${encodeURIComponent(costInput.value)}`;

  fetch("/api/ingredients", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: data,
  })
    .then((response) => {
      if (response.ok) {
        nameInput.value = "";
        typeInput.value = "";
        amountInput.value = "";
        costInput.value = "";
        fetchIngredients();
      } else {
        console.error("Error adding ingredient:", response.statusText);
      }
    })
    .catch((error) => console.error("Error adding ingredient:", error));
}

function editIngredient(editedData) {
  const ingredientId = editedData.ingredientId;

  const data = `name=${encodeURIComponent(
    editedData.ingredientName
  )}&type=${encodeURIComponent(
    editedData.ingredientType
  )}&amount=${encodeURIComponent(
    editedData.amountOrdered
  )}&cost=${encodeURIComponent(editedData.totalCost)}`;

  fetch(`/api/ingredients/${ingredientId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: data,
  })
    .then((response) => {
      console.log(response);
      if (response.ok) {
        fetchIngredients();
      } else {
        console.error("Error updating ingredient:", response.statusText);
      }
    })
    .catch((error) => console.error("Error updating ingredient:", error));
}

function deleteIngredient(ingredientId) {
  fetch(`/api/ingredients/${ingredientId}`, { method: "DELETE" })
    .then((response) => {
      if (response.ok) {
        fetchIngredients();
      } else {
        console.error("Error deleting ingredient:", response.statusText);
      }
    })
    .catch((error) => console.error("Error deleting ingredient:", error));
}

function editRow(row) {
  const cells = row.querySelectorAll("td");
  const editButton = row.querySelector(".edit-btn");

  if (editButton.textContent === "Edit") {
    // switching to edit mode
    for (let i = 1; i < cells.length - 1; i++) {
      const cell = cells[i];
      const originalContent = cell.textContent;
      const inputType = i === 3 ? "number" : "text";
      cell.innerHTML = `<input type="${inputType}" value="${originalContent}" />`;
    }
    editButton.textContent = "Confirm Edit";
  } else {
    const editedData = {
      ingredientId: cells[0].textContent,
      ingredientName: cells[1].querySelector("input").value,
      ingredientType: cells[2].querySelector("input").value,
      amountOrdered: parseFloat(cells[3].querySelector("input").value),
      totalCost: cells[4].querySelector("input").value
        ? parseFloat(cells[4].querySelector("input").value)
        : null,
    };

    cells[1].textContent = editedData.ingredientName;
    cells[2].textContent = editedData.ingredientType;
    cells[3].textContent = editedData.amountOrdered;
    cells[4].textContent =
      editedData.totalCost === null ? "" : editedData.totalCost.toFixed(2);

    editIngredient(editedData);

    editButton.textContent = "Edit";
  }
}

fetchIngredients();
