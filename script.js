const taskInput = document.getElementById('taskInput');
const deadlineInput = document.getElementById('deadlineInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const filterSelect = document.getElementById('filterSelect');

let tasks = [];
function addTask() {
  const taskText = taskInput.value;
  const deadline = new Date(deadlineInput.value).toISOString();

  if (taskText !== '') {
    const task = {
      id: Date.now().toString(),
      text: taskText,
      deadline: deadline,
      completed: false,
    };

    tasks.push(task);
    saveTasksToLocalStorage();

    renderTasks();
    taskInput.value = '';
    deadlineInput.value = '';
  }
}

function toggleTaskCompletion(taskId) {
  tasks = tasks.map((task) =>
    task.id === taskId ? { ...task, completed: !task.completed } : task
  );

  saveTasksToLocalStorage();
  renderTasks();
}

function deleteTask(taskId) {
  tasks = tasks.filter((task) => task.id !== taskId);

  saveTasksToLocalStorage();
  renderTasks();
}

function filterTasks() {
  const selectedFilter = filterSelect.value;
  let filteredTasks = tasks;

  if (selectedFilter === 'completed') {
    filteredTasks = tasks.filter((task) => task.completed);
  } else if (selectedFilter === 'pending') {
    filteredTasks = tasks.filter((task) => !task.completed);
  }

  return filteredTasks;
}

function renderTasks() {
  const filteredTasks = filterTasks();

  taskList.innerHTML = '';
  filteredTasks.forEach((task) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <span class="task-text">${task.text}</span>
      <span class="deadline">Deadline: ${new Date(task.deadline).toLocaleString()}</span>
      <div class="task-actions">
        <button class="toggle-btn">${task.completed ? 'Undo' : 'Done'}</button>
        <button class="delete-btn">Delete</button>
      </div>
    `;

    li.querySelector('.toggle-btn').addEventListener('click', () => {
      toggleTaskCompletion(task.id);
    });

    li.querySelector('.delete-btn').addEventListener('click', () => {
      deleteTask(task.id);
    });

    if (task.completed) {
      li.classList.add('completed');
    }
    taskList.appendChild(li);
  });
}

function saveTasksToLocalStorage() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasksFromLocalStorage() {
  const storedTasks = localStorage.getItem('tasks');
  tasks = storedTasks ? JSON.parse(storedTasks) : [];
}

addBtn.addEventListener('click', addTask);

filterSelect.addEventListener('change', renderTasks);
loadTasksFromLocalStorage();
renderTasks();
