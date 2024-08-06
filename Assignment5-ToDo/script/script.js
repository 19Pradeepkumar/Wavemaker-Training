let taskArray = [];
let currentTaskIndex = null;

window.onload = function() {
    showTaskArray();
    initializeDarkMode();
    document.querySelector('form').addEventListener('submit', function(event) {
        event.preventDefault();
        searchTasks();
    });
    document.getElementById('toggle-dark-mode').addEventListener('click', toggleDarkMode);
};

function openAddTaskDialog() {
    // document.getElementById('dialog-title').textContent = 'Add Task';
    // document.getElementById('edit-title').value = '';
    // document.getElementById('edit-description').value = '';
    // document.getElementById('dialog-priority').value = 'low';
    // document.getElementById('edit-date').value = '';
    currentTaskIndex = null;
    document.getElementById('edit-dialog').showModal();
}

function saveTask() {
    const title = document.getElementById('edit-title').value;
    const description = document.getElementById('edit-description').value;
    const priority = document.getElementById('dialog-priority').value;
    const date = document.getElementById('edit-date').value;

    if (!title || !description || !date) {
        alert('Title, Description, and Date are required.');
        return;
    }

    const task = { title, description, priority, date };

    if (currentTaskIndex === null) {
        taskArray.push(task);
        addTaskToDOM(task);
    } else {
        taskArray[currentTaskIndex] = task;
        const containers = document.querySelectorAll('#task-container .card');
        containers.forEach(card => {
            if (card.querySelector('.card-title').textContent === taskArray[currentTaskIndex].title) {
                updateTaskCard(card, task);
            }
        });
    }

    localStorage.setItem("taskList", JSON.stringify(taskArray));
    document.getElementById('edit-dialog').close();
}

function addTaskToDOM(task) {
    const container = document.createElement('div');
    container.className = 'col-12 col-md-6 col-lg-4 mb-3 task-item';
    container.setAttribute('draggable', 'true');
    container.id = `task-${taskArray.length}`; 

    const card = document.createElement('div');
    card.className = 'card shadow-sm';

    const cardBody = document.createElement('div');
    cardBody.className = 'card-body d-flex align-items-center';

    const checkboxDiv = document.createElement('div');
    checkboxDiv.className = 'me-3';
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'form-check-input';
    checkboxDiv.appendChild(checkbox);
    cardBody.appendChild(checkboxDiv);

    const titleDiv = document.createElement('div');
    titleDiv.className = 'flex-grow-1 card-title';
    titleDiv.textContent = task.title;
    titleDiv.style.fontSize = '18px';
    titleDiv.addEventListener('click', function() {
        openViewTaskDialog(task);
    });
    cardBody.appendChild(titleDiv);

    const dateDiv = document.createElement('div');
    dateDiv.className = 'card-date';
    dateDiv.textContent = task.date;
    dateDiv.style.marginRight = '10px';
    cardBody.appendChild(dateDiv);

    const buttonGroup = document.createElement('div');
    buttonGroup.className = 'btn-group';

    const deleteButton = document.createElement('button');
    deleteButton.className = 'btn btn-danger btn-sm';
    deleteButton.innerHTML = '<i class="fa-solid fa-trash"></i>';
    deleteButton.addEventListener('click', function() {
        removeTask(container);
    });
    buttonGroup.appendChild(deleteButton);

    const editButton = document.createElement('button');
    editButton.className = 'btn btn-secondary btn-sm ms-2';
    editButton.innerHTML = '<i class="fa-solid fa-pen-to-square"></i>';
    editButton.addEventListener('click', function() {
        editTask(container);
    });
    buttonGroup.appendChild(editButton);

    cardBody.appendChild(buttonGroup);
    card.appendChild(cardBody);
    container.appendChild(card);
    document.getElementById('task-container').appendChild(container);

    container.addEventListener('dragstart', handleDragStart);
    container.addEventListener('dragend', handleDragEnd);
    updateTaskCard(card, task);
}

function updateTaskCard(card, task) {
    const priority = task.priority;

    card.classList.remove('priority-low', 'priority-medium', 'priority-high');

    if (priority === 'low') {
        card.classList.add('priority-low');
    } else if (priority === 'medium') {
        card.classList.add('priority-medium');
    } else if (priority === 'high') {
        card.classList.add('priority-high');
    }
}

function removeTask(taskContainer) {
    const title = taskContainer.querySelector('.card-title').textContent;
    taskArray = taskArray.filter(task => task.title !== title);
    localStorage.setItem("taskList", JSON.stringify(taskArray));
    taskContainer.remove();
}

function editTask(taskContainer) {
    currentTaskIndex = taskArray.findIndex(task => task.title === taskContainer.querySelector('.card-title').textContent);

    const task = taskArray[currentTaskIndex];
    document.getElementById('edit-title').value = task.title;
    document.getElementById('edit-description').value = task.description;
    document.getElementById('dialog-priority').value = task.priority;
    document.getElementById('edit-date').value = task.date;

    document.getElementById('dialog-title').textContent = 'Edit Task';
    document.getElementById('edit-dialog').showModal();
}

function dialogClose() {
    document.getElementById('edit-dialog').close();
}

function showTaskArray() {
    const savedTasks = localStorage.getItem('taskList');
    if (savedTasks) {
        taskArray = JSON.parse(savedTasks);
        taskArray.forEach(task => addTaskToDOM(task));
    }
}

function openViewTaskDialog(task) {
    document.getElementById('view-title').textContent = task.title;
    document.getElementById('view-description').textContent = task.description;
    document.getElementById('view-date').textContent = task.date;
    document.getElementById('view-task-dialog').showModal();
}

function closeViewTaskDialog() {
    document.getElementById('view-task-dialog').close();
}

function searchTasks() {
    const query = document.querySelector('input[type="search"]').value.toLowerCase();
    const taskContainers = document.querySelectorAll('#task-container .task-item');

    taskContainers.forEach(container => {
        const title = container.querySelector('.card-title').textContent.toLowerCase();
        if (title.includes(query)) {
            container.style.display = 'block';
        } else {
            container.style.display = 'none';
        }
    });
}

function toggleDarkMode() {
    const body = document.body;
    const navbar = document.querySelector('.navbar');
    const cards = document.querySelectorAll('.card');
    const toggleButton = document.getElementById('toggle-dark-mode');

    body.classList.toggle('dark-mode');
    navbar.classList.toggle('bg-light');
    navbar.classList.toggle('dark-mode');
    cards.forEach(card => card.classList.toggle('dark-mode'));

    const isDarkMode = body.classList.contains('dark-mode');
    toggleButton.textContent = isDarkMode ? '🌞 Light Mode' : '🌙 Dark Mode';

    // Save preference in localStorage
    localStorage.setItem('darkMode', isDarkMode);
}

function initializeDarkMode() {
    const darkModePreference = localStorage.getItem('darkMode') === 'true';
    if (darkModePreference) {
        document.body.classList.add('dark-mode');
        document.querySelector('.navbar').classList.add('dark-mode');
        document.querySelectorAll('.card').forEach(card => card.classList.add('dark-mode'));
        document.getElementById('toggle-dark-mode').textContent = '🌞 Light Mode';
    }
}

// Drag and Drop Handlers
function handleDragStart(event) {
    event.dataTransfer.setData('text/plain', event.target.id);
    event.target.classList.add('dragging');
}

function handleDragEnd(event) {
    event.target.classList.remove('dragging');
}

function allowDrop(event) {
    event.preventDefault();
}

function drop(event) {
    event.preventDefault();
    const draggedElementId = event.dataTransfer.getData('text/plain');
    const draggedElement = document.getElementById(draggedElementId);
    const dropTarget = event.target.closest('.task-item');

    if (dropTarget && draggedElement !== dropTarget) {
        const taskContainer = document.getElementById('task-container');
        taskContainer.insertBefore(draggedElement, dropTarget.nextSibling);
    }
}
