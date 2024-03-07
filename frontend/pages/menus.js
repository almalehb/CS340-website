fetchMenus();

function fetchMenus() {
    fetch('/api/menus')
        .then(response => response.json())
        .then(menus => renderMenusTable(menus));
}

function renderMenusTable(menus) {
    const menusTableBody = document.querySelector('table tbody');
    menusTableBody.innerHTML = '';

    menus.forEach(menu => {
        const row = menusTableBody.insertRow();
        const idCell = row.insertCell();
        const restaurantIdCell = row.insertCell();
        const typeCell = row.insertCell();
        const dateUpdatedCell = row.insertCell();
        const operationsCell = row.insertCell();

        idCell.textContent = menu.menuId;
        restaurantIdCell.textContent = menu.restaurantId;
        typeCell.textContent = menu.menuType;
        const originalDate = menu.dateUpdated;
        const formattedDate = formatDate(originalDate);
        dateUpdatedCell.textContent = formattedDate;

        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.classList.add('edit-btn');
        editButton.addEventListener('click', () => editRow(row, menu));

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', () => deleteMenu(menu.menuId));

        operationsCell.appendChild(editButton);
        operationsCell.appendChild(deleteButton);
    });
}

function formatDate(dateString) {
    const dateObj = new Date(dateString);
    return dateObj.toISOString().slice(0, 10);
}

function addMenu() {
    const restaurantIdInput = document.getElementById('restaurantId');
    const menuTypeInput = document.getElementById('menuType');
    const dateUpdatedInput = document.getElementById('dateUpdated');

    // const data = `restaurantId=${encodeURIComponent(parseInt(restaurantIdInput.value))}&menuType=${encodeURIComponent(menuTypeInput.value)}&dateUpdated=${encodeURIComponent(dateUpdatedInput.value)}`;

    const data = `restaurantId=${encodeURIComponent(restaurantIdInput.value)}&menuType=${encodeURIComponent(menuTypeInput.value)}&dateUpdated=${encodeURIComponent(dateUpdatedInput.value)}`;

    fetch('/api/menus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: data
    })
        .then(response => {
            if (response.ok) {
                restaurantIdInput.value = '';
                menuTypeInput.value = '';
                dateUpdatedInput.value = '';
                fetchMenus();
            } else {
                console.error('Error adding menu:', response.statusText);
            }
        })
        .catch(error => console.error('Error adding menu:', error));
}

// adding listener to the form
document.querySelector('form').addEventListener('submit', (event) => {
    event.preventDefault();
    addMenu()
});

function editMenu(menuId, editedData) {
    const data = `restaurantId=${encodeURIComponent(editedData.restaurantId)}&menuType=${encodeURIComponent(editedData.menuType)}&dateUpdated=${encodeURIComponent(editedData.dateUpdated)}`;

    fetch(`/api/menus/${menuId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: data
    })
        .then(response => {
            if (response.ok) {
                fetchMenus();
            } else {
                console.error('Error updating menu:', response.statusText);
            }
        })
        .catch(error => console.error('Error updating menu:', error));
}

function editRow(row) {
    const cells = row.querySelectorAll('td');
    const editButton = row.querySelector('.edit-btn');
    const menuId = cells[0].textContent;

    if (editButton.textContent === 'Edit') {
        cells[1].innerHTML = `<input type='number' value='${cells[1].textContent}' />`;
        cells[2].innerHTML = `<input type='text' value='${cells[2].textContent}' />`;
        cells[3].innerHTML = `<input type='date' value='${cells[3].textContent}' />`;
        editButton.textContent = 'Confirm Edit';
    } else {
        const editedData = {
            restaurantId: cells[1].querySelector('input').value,
            menuType: cells[2].querySelector('input').value,
            dateUpdated: cells[3].querySelector('input').value
        };

        editMenu(menuId, editedData);
        editButton.textContent = 'Edit';
    }
}

function deleteMenu(menuId) {
    fetch(`/api/menus/${menuId}`, { method: 'DELETE' })
        .then(response => {
            if (response.ok) {
                fetchMenus();
            } else {
                console.error('Error deleting menu:', response.statusText);
            }
        })
        .catch(error => console.error('Error deleting menu:', error));
}
