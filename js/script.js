// Selectors
const form = document.getElementById('todo-form');
const input = document.getElementById('task-input');
const taskList = document.getElementById('task-list');
const filter = document.getElementById('filter');
const sort = document.getElementById('sort');

// Load tasks from local storage when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    savedTasks.forEach(task => {
        addTaskToList(task.text, task.completed);
    });
});

// Event Listeners
form.addEventListener('submit', addTask);
taskList.addEventListener('click', handleTaskClick);
filter.addEventListener('change', filterTasks);
sort.addEventListener('change', sortTasks);

// Functions
function addTask(e) {
    e.preventDefault();

    const taskText = input.value.trim();
    if (taskText === '') {
        alert('Please enter a task.');
        return;
    }

    addTaskToList(taskText, false);
    input.value = '';

    // Save tasks to local storage
    saveTasksToLocalStorage();
}

function addTaskToList(taskText, completed) {
    const li = document.createElement('li');
    li.innerHTML = `
        <input type="checkbox" class="checkbox" ${completed ? 'checked' : ''}>
        <span ${completed ? 'style="text-decoration: line-through;"' : ''}>${taskText}</span>
        <button class="edit-btn">Edit</button>
        <button class="delete-btn">X</button>
    `;
    taskList.appendChild(li);
}

function handleTaskClick(e) {
    if (e.target.classList.contains('delete-btn')) {
        const taskItem = e.target.parentElement;
        const taskText = taskItem.querySelector('span').textContent;
        if (confirm(`Are you sure you want to cancel "${taskText}"?`)) {
            taskItem.remove();
            showCancelMessage(taskText);
            // Save tasks to local storage after deletion
            saveTasksToLocalStorage();
        }
    } else if (e.target.classList.contains('checkbox')) {
        const taskText = e.target.nextElementSibling;
        if (e.target.checked) {
            taskText.style.textDecoration = 'line-through';
        } else {
            taskText.style.textDecoration = 'none';
        }
        // Save tasks to local storage after marking as completed
        saveTasksToLocalStorage();
    } else if (e.target.classList.contains('edit-btn')) {
        const taskText = e.target.previousElementSibling;
        const newText = prompt('Edit Task', taskText.textContent);
        if (newText !== null && newText.trim() !== '') {
            taskText.textContent = newText.trim();
            // Save tasks to local storage after editing
            saveTasksToLocalStorage();
        }
    }
}

function filterTasks() {
    const completedTasks = taskList.querySelectorAll('.checkbox:checked').length;
    const totalTasks = taskList.querySelectorAll('li').length;

    if (filter.value === 'all') {
        taskList.querySelectorAll('li').forEach(task => {
            task.style.display = 'flex';
        });
    } else if (filter.value === 'completed') {
        taskList.querySelectorAll('li').forEach(task => {
            if (task.querySelector('.checkbox').checked) {
                task.style.display = 'flex';
            } else {
                task.style.display = 'none';
            }
        });
    } else if (filter.value === 'pending') {
        taskList.querySelectorAll('li').forEach(task => {
            if (!task.querySelector('.checkbox').checked) {
                task.style.display = 'flex';
            } else {
                task.style.display = 'none';
            }
        });
    }
}

function sortTasks() {
    const tasksArray = Array.from(taskList.children);
    if (sort.value === 'priority') {
        tasksArray.sort((a, b) => {
            const aChecked = a.querySelector('.checkbox').checked;
            const bChecked = b.querySelector('.checkbox').checked;
            return aChecked - bChecked;
        });
    } else if (sort.value === 'alphabetical') {
        tasksArray.sort((a, b) => {
            const aText = a.querySelector('span').textContent.toLowerCase();
            const bText = b.querySelector('span').textContent.toLowerCase();
            return aText.localeCompare(bText);
        });
    }
    taskList.innerHTML = '';
    tasksArray.forEach(task => {
        taskList.appendChild(task);
    });
}

function saveTasksToLocalStorage() {
    const tasks = [];
    taskList.querySelectorAll('li').forEach(taskItem => {
        const taskText = taskItem.querySelector('span').textContent;
        const completed = taskItem.querySelector('.checkbox').checked;
        tasks.push({ text: taskText, completed: completed });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function showCancelMessage(taskText) {
    const cancelMessage = document.createElement('div');
    cancelMessage.classList.add('cancel-message');
    cancelMessage.textContent = `"${taskText}" canceled`;

    document.body.appendChild(cancelMessage);

    setTimeout(() => {
        cancelMessage.classList.add('show');
        setTimeout(() => {
            cancelMessage.classList.remove('show');
            setTimeout(() => {
                cancelMessage.remove();
            }, 300); // Wait for the transition to complete before removing the element
        }, 5000); // Display for 5 seconds
    }, 100); // Ensure the animation starts smoothly
}
