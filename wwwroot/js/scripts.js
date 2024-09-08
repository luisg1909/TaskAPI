document.getElementById('task-form').addEventListener('submit', handleFormSubmit);
document.getElementById('sort-ok-button').addEventListener('click', handleSortOkButton);

let editingTaskId = null;

function handleFormSubmit(e) {
    e.preventDefault();

    const title = document.getElementById('task-title').value;
    const description = document.getElementById('description').value;
    const priority = document.getElementById('priority').value;
    const dueDate = document.getElementById('dueDate').value;
    const status = document.getElementById('status').value;

    const taskData = { title, description, priority, dueDate, status };

    if (editingTaskId) {
        updateTask(editingTaskId, { ...taskData, taskId: editingTaskId });
    } else {
        addTask(taskData);
    }
}

function handleSortOkButton(e) {
    e.preventDefault();
    const sortBy = document.getElementById('sort-by').value;
    const sortNotification = document.getElementById('sort-notification');
    const sortOptionText = document.getElementById('sort-by').selectedOptions[0].text;
    sortNotification.textContent = `You chose to sort by ${sortOptionText}.`;
    sortNotification.style.display = 'block';
    loadTasks();
}

function addTask(taskData) {
    fetch('http://localhost:5293/api/tasks', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(taskData)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
        loadTasks();
        resetForm();
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

function loadTasks() {
    const sortBy = document.getElementById('sort-by').value;

    fetch('http://localhost:5293/api/tasks')
    .then(response => response.json())
    .then(data => {
        if (sortBy === 'priority-asc') {
            data.sort((a, b) => a.priority - b.priority);
        } else if (sortBy === 'priority-desc') {
            data.sort((a, b) => b.priority - a.priority);
        } else if (sortBy === 'status-asc') {
            data.sort((a, b) => a.status.localeCompare(b.status));
        } else if (sortBy === 'status-desc') {
            data.sort((a, b) => b.status.localeCompare(a.status));
        }

        const tasksTableBody = document.querySelector('#tasks tbody');
        tasksTableBody.innerHTML = '';
        data.forEach(task => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${task.title}</td>
                <td>${task.description}</td>
                <td>${task.priority}</td>
                <td>${task.dueDate}</td>
                <td>${task.status}</td>
                <td>
                    <button class="delete-task" onclick="deleteTask(${task.taskId})">Delete</button>
                    <button class="edit-task" onclick="editTask(${task.taskId})">Edit</button>
                </td>
            `;
            tasksTableBody.appendChild(row);
        });
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

function deleteTask(id) {
    fetch(`http://localhost:5293/api/tasks/${id}`, {
        method: 'DELETE',
    })
    .then(response => {
        console.log('Deleted:', id);
        loadTasks();
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

function editTask(id) {
    fetch(`http://localhost:5293/api/tasks/${id}`)
    .then(response => response.json())
    .then(task => {
        const newTitle = `${task.title}`;
        document.getElementById('task-title').value = newTitle;
        document.getElementById('description').value = task.description;
        document.getElementById('priority').value = task.priority;
        document.getElementById('dueDate').value = task.dueDate ? task.dueDate.split('T')[0] : '';
        document.getElementById('status').value = task.status;

        editingTaskId = id;

        const submitButton = document.querySelector('#task-form button');
        submitButton.textContent = 'Edit Task';
        submitButton.classList.remove('add-task');
        submitButton.classList.add('edit-task');

        // Update the form title
        const formTitle = document.querySelector('#form-section h2');
        formTitle.textContent = `Editing Task: ${newTitle}`;
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

function updateTask(id, taskData) {
    fetch(`http://localhost:5293/api/tasks/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(taskData)
    })
    .then(response => {
        if (response.ok) {
            console.log('Updated:', id);
            loadTasks();
            resetForm();
        } else {
            return response.json().then(err => {
                console.error('Update failed:', err);
                alert(`Error: ${err.title}\nDetails: ${JSON.stringify(err.errors)}`);
            });
        }
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

function resetForm() {
    document.getElementById('task-title').value = '';
    document.getElementById('description').value = '';
    document.getElementById('priority').value = '';
    document.getElementById('dueDate').value = '';
    document.getElementById('status').value = 'Not Started';

    editingTaskId = null;

    const submitButton = document.querySelector('#task-form button');
    submitButton.textContent = 'Add Task';
    submitButton.classList.remove('edit-task');
    submitButton.classList.add('add-task');

    // Reset the form title
    const formTitle = document.querySelector('#form-section h2');
    formTitle.textContent = 'Add New Task';
}

document.addEventListener('DOMContentLoaded', loadTasks);
