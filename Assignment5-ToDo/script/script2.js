let taskArray = [];
let currentTaskIndex = null;
let subtasks = [];

window.onload = function() {
    showTaskArray();
    initializeDarkMode();
    document.getElementById('search-form').addEventListener('submit', function(event) {
        event.preventDefault();
        searchTasks();
    });
    setInterval(checkTasksDueSoon, 100000);
    document.getElementById('toggle-dark-mode').addEventListener('click', toggleDarkMode);
    document.getElementById('sort-options').addEventListener('change', sortTasks);
    document.querySelector('.btn.ml-2.border.border-dark').addEventListener('click', exportTasks);
    document.getElementById('import-file').addEventListener('change', handleFileImport);
};

function openAddTaskDialog() {
    currentTaskIndex = null;
    document.getElementById('dialog-title').textContent = 'Add Task';
    document.getElementById('edit-title').value = '';
    document.getElementById('edit-description').value = '';
    document.getElementById('dialog-priority').value = 'low';
    document.getElementById('edit-date').value = '';
    document.getElementById('edit-time').value = '';
    document.getElementById('subtask-list').innerHTML = '';
    subtasks = [];
    document.getElementById('edit-dialog').showModal();
}

function saveTask() {
    const title = document.getElementById('edit-title').value;
    const description = document.getElementById('edit-description').value;
    const priority = document.getElementById('dialog-priority').value;
    const date = document.getElementById('edit-date').value;
    const time = document.getElementById('edit-time').value;

    if (!title || !description || !date || !time) {
        alert('Title, Description, Date, and Time are required.');
        return;
    }

    const task = { title, description, priority, date, time, subtasks };

    if (currentTaskIndex === null) {
        taskArray.push(task);
        addTaskToDOM(task);
    } else {
        taskArray[currentTaskIndex] = task;
        const taskCards = document.querySelectorAll('#task-container .task-item');
        taskCards.forEach(card => {
            if (card.querySelector('.card-title').textContent === task.title) {
                updateTaskCard(card, task);
            }
        });
    }

    localStorage.setItem("taskList", JSON.stringify(taskArray));
    document.getElementById('edit-dialog').close();
}

let count = 1;

function structure(taskType,task) {
    //if(task!=null){
    const card = document.createElement('div');
    card.className = `col-10 card shadow-sm mb-2 priority-${task.priority} task-item ${taskType}`;
    card.id = count;
    task.id=count;
    count++;
    card.draggable = true;

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
    titleDiv.addEventListener('click', function () {
        openViewTaskDialog(task);
    });
    cardBody.appendChild(titleDiv);

    const dateDiv = document.createElement('div');
    dateDiv.className = 'card-date';
    dateDiv.textContent = `${task.date} ${task.time}`;
    dateDiv.style.marginRight = '10px';
    cardBody.appendChild(dateDiv);

    const buttonGroup = document.createElement('div');
    buttonGroup.className = 'btn-group';

    const deleteButton = document.createElement('button');
    deleteButton.className = 'btn btn-danger btn-sm';
    deleteButton.innerHTML = '<i class="fa-solid fa-trash"></i>';
    deleteButton.addEventListener('click', function () {
        removeTask(card);
    });
    buttonGroup.appendChild(deleteButton);

    const editButton = document.createElement('button');
    editButton.className = 'btn btn-secondary btn-sm ms-2';
    editButton.innerHTML = '<i class="fa-solid fa-pen-to-square"></i>';
    editButton.addEventListener('click', function () {
        editTask(card);
    });
    buttonGroup.appendChild(editButton);
    cardBody.appendChild(buttonGroup);
    card.appendChild(cardBody);
    return card;
//}
}



function addTaskToDOM(task) {
    const taskDate = new Date(`${task.date}T${task.time}`);
    const today = new Date();
        if(taskDate>today){
        const container = document.createElement('div');
        container.className = 'col-10 col-md-10 col-lg-10 mb-3 task-container';


        let parent=count

        const card = structure('main-task',task);

        card.addEventListener('dragstart', handleDragStart);
        card.addEventListener('dragover', handleDragOver);
        card.addEventListener('drop', handleDrop);

        container.appendChild(card);
        if(task.subtasks.length > 0){
        for (let i = 0; i < task.subtasks.length; i++) {
            const subtask = structure('child-task',task.subtasks[i]);
            subtask.setAttribute('data-parent-id', parent);
            subtask.style.marginLeft = '10%';
            subtask.addEventListener('dragstart', handleDragStart);
            subtask.addEventListener('dragover', handleDragOver);
            subtask.addEventListener('drop', handleDrop);
            container.appendChild(subtask);
        }
    }
        document.getElementById('task-container').appendChild(container);
}
}



function handleDragStart(e) {
    e.dataTransfer.setData('text/plain', e.target.id);
    e.target.classList.add('dragging');
}

function handleDragOver(e) {
    e.preventDefault();
}

function handleDrop(e) {
    e.preventDefault();

    const taskId = e.dataTransfer.getData('text/plain');
    const taskElement = document.getElementById(taskId);
    const taskContainer = document.getElementById('task-container');
    const targetElement = e.target.closest('.task-item');
    console.log(taskId,targetElement.id);

    if (taskElement && taskContainer) {
        const DraggedMainTask = taskElement.classList.contains('main-task');
        const TargetMainTask = targetElement && targetElement.classList.contains('main-task');

        if (DraggedMainTask && TargetMainTask) {
            console.log('entered main');
            const targetContainer = targetElement.parentNode;
            const draggedContainer = taskElement.parentNode;
            targetContainer.replaceChild(taskElement, targetElement);
            draggedContainer.appendChild(targetElement);

            const draggedSubtasks = Array.from(draggedContainer.querySelectorAll('.child-task'));
            const targetSubtasks = Array.from(targetContainer.querySelectorAll('.child-task'));

            draggedSubtasks.forEach(subtask => {
                targetContainer.appendChild(subtask);
            });

            targetSubtasks.forEach(subtask => {
                draggedContainer.appendChild(subtask);
            });

        }
        else if (targetElement && taskContainer.contains(targetElement)) {
            const rect = targetElement.getBoundingClientRect();
            const horizontalOffset = e.clientX - rect.left;
            console.log('entered first');
            if (horizontalOffset < 20) {
                console.log('entered here');
                // if (taskElement.classList.contains('child-task')) {
                //     taskElement.classList.remove('child-task');
                //     taskElement.classList.add('main-task');
                //     taskElement.style.marginLeft = '0';
                // }

                // if (e.clientY > rect.top + rect.height / 2) {
                //     const nextElement = targetElement.nextElementSibling;
                //     if (nextElement) {
                //         targetElement.parentNode.insertBefore(taskElement, nextElement);
                //     } else {
                //         targetElement.parentNode.appendChild(taskElement);
                //     }
                // } else {
                //     targetElement.parentNode.insertBefore(taskElement, targetElement);
                // }

            } else if (targetElement.classList.contains('child-task') && !taskElement.classList.contains('main-task')) { // Reorder within 
                console.log('entered 3rd');
                const parentIdoftarget = targetElement.getAttribute('data-parent-id');
                const parentIdoftask = taskElement.getAttribute('data-parent-id');
                console.log( parentIdoftask, parentIdoftarget)

                
                if (e.clientY > rect.top + rect.height / 2) {
                    const nextElement = targetElement.nextElementSibling;
                    if (nextElement) {
                        targetElement.parentNode.insertBefore(taskElement, nextElement);
                    } else {
                        targetElement.parentNode.appendChild(taskElement);
                    }
                } else {
                    targetElement.parentNode.insertBefore(taskElement, targetElement);
                }

                let targetSubTask;
                taskArray.forEach((task)=>{
                    console.log(task);
                    console.log(String(task.id),parentIdoftarget);
                    if(parentIdoftask==task.id){
                       subTaskCopy = task.subtasks
                       subTaskCopy.forEach((subtask,index) => {
                        if(subtask.id == taskId) {
                            targetSubTask = subtask;
                            task.subtasks.splice(index,1)
                        }
                       })
                    }
                })


                taskArray.forEach((task,index)=>{
                    if(parentIdoftarget==task.id && targetSubTask!=null){
                       taskArray[index].subtasks.push(targetSubTask)
                    }
                })
                console.log( taskArray, targetSubTask)
                localStorage.setItem("taskList", JSON.stringify(taskArray));
            }
        } else {
            console.log('enetered 4');
            taskElement.classList.remove('child-task');
            taskElement.classList.add('main-task');
            taskElement.style.marginLeft = '0';
            taskContainer.appendChild(taskElement);
        }
    }
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
    document.getElementById('edit-time').value = task.time;

    subtasks = task.subtasks;
    showSubtaskList();

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
    sortTasks();
}

function openViewTaskDialog(task) {
    console.log('clicking');
    document.getElementById('view-title').textContent = task.title;
    document.getElementById('view-description').textContent = "Description :  " + task.description;
    document.getElementById('view-date').textContent = `${task.date} ${task.time}`;

    const viewSubtasks = document.getElementById('view-subtasks');
    viewSubtasks.innerHTML = '';
    task.subtasks.forEach(subtask => {
        viewSubtasks.innerHTML += `
            <div class="subtask mb-2 p-2 border">
                <p><strong>${subtask.title}</strong></p>
                <p>${subtask.description}</p>
                <p>Date: ${subtask.date}</p>
                <p>Time: ${subtask.time}</p>
                <p>Priority: ${subtask.priority}</p>
            </div>
        `;
    });

    document.getElementById('view-task-dialog').showModal();
}

function closeViewTaskDialog() {
    document.getElementById('view-task-dialog').close();
}

function searchTasks() {
    console.log('hi');
    const query = document.querySelector('#search-input').value.toLowerCase();
    const taskItems = document.querySelectorAll('.task-item');

    taskItems.forEach(item => {
        let flag = 0;
        const title = item.querySelector('.card-title').textContent.toLowerCase();
        if (title.includes(query)) {
            item.style.display = 'block';
            flag = 1;
        }
       
        let subtasks = []
        taskArray.forEach(task => {
          if(task.title == title) {
            subtasks = task.subtasks
            //break;
          }
        })
        console.log(subtasks)
        subtasks.forEach(subTask => {
            if (subTask.title.includes(query)) {
                item.style.display = 'block';
                flag=1;
            }
        })
        if(flag==0) {
            item.style.display = 'none';
        }
    });
}

function toggleDarkMode() {
    const body = document.body;
    body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', body.classList.contains('dark-mode'));
}

function initializeDarkMode() {
    const darkMode = localStorage.getItem('darkMode') === 'true';
    if (darkMode) {
        document.body.classList.add('dark-mode');
    }
}

function sortTasks() {
    const sortOption = document.getElementById('sort-options').value;
    if (sortOption === 'priority') {
        taskArray.sort((a, b) => {
            const priorities = { 'low': 1, 'medium': 2, 'high': 3 };
            return priorities[b.priority] - priorities[a.priority];
        });
        
    } else if (sortOption === 'time') {
        console.log('bytime');
        taskArray.sort((a, b) => new Date(a.date) - new Date(b.date));
    }
    const taskArrayCopy = taskArray
    taskArrayCopy.forEach((task,index) => {
        let subtaskarray = task.subtasks

        if (sortOption === 'priority') {
            
            subtaskarray.sort((a, b) => {
                const priorities = { 'low': 1, 'medium': 2, 'high': 3 };
                return priorities[b.priority] - priorities[a.priority];
            });
            taskArray[index].subtasks = subtaskarray
        } else if (sortOption === 'time') {
            subtaskarray.sort((a, b) => new Date(a.date) - new Date(b.date));
            taskArray[index].subtasks = subtaskarray
        }
    })

    document.getElementById('task-container').innerHTML = '';
    taskArray.forEach(task => addTaskToDOM(task));
}

function checkTasksDueSoon() {
    const currentDateTime = new Date();
    taskArray.forEach(task => {
        const taskDateTime = new Date(`${task.date} ${task.time}`);
        const timeDiff = taskDateTime - currentDateTime;
        const tenMinutesInMs = 10 * 60 * 1000;
        if (timeDiff > 0 && timeDiff <= tenMinutesInMs) {
            notifyMe(`Task "${task.title}" is due in 10 minutes or less!`)
        }
    });
}

function notifyMe(text) {
    if (!("Notification" in window)) {
      alert("This browser does not support desktop notification");
    } else if (Notification.permission === "granted") {
      const notification = new Notification(text);
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          const notification = new Notification(text);
        }
      });
    }

  }
  


function addSubtask() {
    const title = document.getElementById('subtask-title').value;
    const description = document.getElementById('subtask-description').value;
    const date = document.getElementById('subtask-date').value;
    const time = document.getElementById('subtask-time').value;
    const priority = document.getElementById('subtask-priority').value;

    if (!title || !description || !date || !time) {
        alert('Title, Description, Date, and Time are required for subtasks.');
        return;
    }

    const subtask = { title, description, date, time, priority };
    subtasks.push(subtask);
    showSubtaskList();

    document.getElementById('add-subtask-dialog').close();
}

function showSubtaskList() {
    const subtaskList = document.getElementById('subtask-list');
    subtaskList.innerHTML = '';
    subtasks.forEach((subtask, index) => {
        const subtaskItem = document.createElement('div');
        subtaskItem.className = 'subtask-item border p-2 mb-2';

        subtaskItem.innerHTML = `
            <p><strong>${subtask.title}</strong></p>
            <p>${subtask.description}</p>
            <p>Date: ${subtask.date}</p>
            <p>Time: ${subtask.time}</p>
            <p>Priority: ${subtask.priority}</p>
            <button class="btn btn-danger btn-sm" onclick="removeSubtask(${index})">Remove</button>
        `;
        subtaskList.appendChild(subtaskItem);
    });
}

function removeSubtask(index) {
    subtasks.splice(index, 1);
    showSubtaskList();
}

function openAddSubtaskDialog() {
    document.getElementById('subtask-title').value = '';
    document.getElementById('subtask-description').value = '';
    document.getElementById('subtask-date').value = '';
    document.getElementById('subtask-time').value = '';
    document.getElementById('subtask-priority').value = 'low';
    document.getElementById('add-subtask-dialog').showModal();
}

function closeSubtaskDialog() {
    document.getElementById('add-subtask-dialog').close();
}

function exportTasks() {
    const taskListJSON = JSON.stringify(taskArray);
    const blob = new Blob([taskListJSON], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'taskList.json';
    a.click();
    URL.revokeObjectURL(url);
}


function importTasks() {
    document.getElementById('import-file').click();
}

function handleFileImport(event) {
    const file = event.target.files[0];
    if (!file) {
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const importedTasks = JSON.parse(e.target.result);
            if (Array.isArray(importedTasks)) {
                taskArray = importedTasks;
                localStorage.setItem('taskList', JSON.stringify(taskArray));
                document.getElementById('task-container').innerHTML = '';
                taskArray.forEach(task => addTaskToDOM(task));
                alert('Tasks imported successfully!');
            }
        } catch (error) {
            alert('Error reading file. Please upload a valid JSON file.');
        }
    };
    reader.readAsText(file);
}