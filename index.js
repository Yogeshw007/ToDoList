// List of to do items
let todoLists = new Array();

// Elements
const todoTextInput = document.getElementById('todo-textbox');
const tasks = document.getElementById('tasks');
const taskCount = document.getElementById('task-count');
const addItemButton = document.getElementById('add-item-icon');
const listFilters = document.querySelectorAll('#tasks-filter > *');
const completeAllTaskBtn = document.getElementById('complete-all-task');
const clearCompletedBtn = document.getElementById('clear-completed');
const starsContainer = document.getElementById('star-container');

let currentFilter = 'all';

//Focus the input field to start entering the todo item at initial load itself.
todoTextInput.focus();

//Click event listener for complete all tasks, remove completed buttons
completeAllTaskBtn.addEventListener('click', completeAllTask);
clearCompletedBtn.addEventListener('click', removeCompletedTaskItem);

//Click event listener for remove a task and mark a item as completed on the buttons
tasks.addEventListener('click', removeTaskItem);
tasks.addEventListener('click', completeTask);

//Event listeners (Click and keypress - 'ENTER' key) for adding an item to the todo list
addItemButton.addEventListener('click', addToDoItemToList);
todoTextInput.addEventListener('keypress', addToDoItemToList);

// Click event listener to filter the todo item based on the completion status
for (let filter of listFilters) {
    filter.addEventListener('click', filterList);
}

// Defaulting the filter to show all the todo items
filterListByName(currentFilter);

//Remove an item from the todolist when click on the cross icon in list todo item
function removeTaskItem(e) {
    if (e.target !== undefined && e.srcElement.nodeName === 'I' && e.target.className.includes('remove-task')) {
        todoLists = todoLists.filter((item) => {
            return item.id !== Number(e.target.getAttribute('data-id'));
        });
    }
    renderToDoList(currentFilter);
}

//Remove the completed task from the todo list
function removeCompletedTaskItem() {
    todoLists = todoLists.filter((item) => {
        return !item.completed;
    });
    renderToDoList(currentFilter);
}

//Function to filter the todo item with the completion status
function filterListByName(filterName) {
    for (let filter of listFilters) {
        if (filter.getAttribute('data-name') === filterName) {
            filter.style.fontWeight = 'bold';
            filter.style.color = 'black';
            renderToDoList(filter.getAttribute('data-name'));
            return;
        }
    }
}

//Function to filter the todo list based on the filter clicked
function filterList(e) {
    for (let filter of listFilters) {
        filter.style.fontWeight = 'normal';
        filter.style.color = '#8394ac';
    }
    e.target.style.fontWeight = 'bold';
    e.target.style.color = 'black';
    currentFilter = e.target.getAttribute('data-name');
    renderToDoList(e.target.getAttribute('data-name'));
}

//Function to Complete the todo item when the todo item is checked
function completeTask(e) {
    for (let item of todoLists) {
        if (item['id'] === Number(e.target.getAttribute('data-id'))) {
            item.completed = !item.completed;
        }
    }

    renderToDoList(currentFilter);
}

//Function to mark all the todo item as completed
function completeAllTask() {
    for (let item of todoLists) {
        item.completed = true;
    }
    renderToDoList(currentFilter);
}

//Render the list of todo item on the web page
function renderToDoList(filterName) {
    tasks.innerHTML = '';

    let itemCount = 0;
    let uncompletedItem = true;

    //Iteration over the todo list items
    for (let item of todoLists) {
        if (filterName !== undefined && filterName === 'uncomplete' && item.completed === true) {
            continue;
        } else if (filterName !== undefined && filterName === 'completed' && item.completed !== true) {
            continue;
        }

        const taskItem = document.createElement('li');
        taskItem.setAttribute('data-id', item['id']);
        taskItem.className = 'task flex-center-x-between';

        let taskDetail;
        let taskTitle;

        //Adding tick or circle icon based on the completion status of the todo item
        if (item['completed'] === true) {
            taskDetail = `<i class="fa-regular fa-circle-check fa-xl position-relative flex-center completed" data-id="${item['id']}">
                <input type="checkbox" class="task-status-checkbox position-absolute" name="task-status">
            </i>`;
            taskTitle = `<p class="task-title strike-through completed">${item['title']}</p>`;
        } else {
            taskDetail = `<i class="fa-regular fa-circle fa-xl position-relative flex-center" data-id="${item['id']}">
                <input type="checkbox" class="task-status-checkbox position-absolute" name="task-status">
            </i>`;
            taskTitle = `<p class="task-title">${item['title']}</p>`;
        }

        taskItem.innerHTML = `
            <div class="task-detail flex-center">
                <div class="task-status flex-center">  
                    ${taskDetail}
                </div>
                ${taskTitle}
            </div>
            <i class="fa-regular fa-circle-xmark fa-xl remove-task" data-id="${item['id']}"></i>
            `;

        // Appending each todo list item to the tasks which renders on the web page
        tasks.append(taskItem);

        itemCount++;
        uncompletedItem = uncompletedItem && item['completed'];
    }

    //Update the task count in footer
    taskCount.textContent = itemCount;

    shakeTitle();

    //Show the congrats star when all the tasks available are completed
    if (uncompletedItem && todoLists.length > 0) {
        if (!(filterName !== undefined && filterName === 'all')) {
            return;
        }
        showStars();
    }
}

//Add a todo item to the list
function addToDoItemToList(e) {
    if (e.type === 'keypress' && e.key !== 'Enter') {
        return;
    }

    if (todoTextInput.value === '') {
        alert('Please enter a title to add');
        return;
    }

    let todoObj = new Object();

    todoObj.id = new Date().getTime();
    todoObj.title = todoTextInput.value;
    todoObj.completed = false;

    todoLists.push(todoObj);
    todoTextInput.value = '';

    renderToDoList(currentFilter);
}

//Function to trigger the stars to appear on the web page for 5 seconds
function showStars() {
    starsContainer.classList.add('start');

    setTimeout(() => {
        starsContainer.classList.remove('start');
    }, 5000);
}

//Function to add dynamic class to shake the todo title
function shakeTitle() {
    let taskTitles = document.getElementsByClassName('task-title');

    for (let taskTitle of taskTitles) {
        if (taskTitle.className.includes('completed')) {
            taskTitle.classList.toggle('animation-start');
            setTimeout(() => {
                taskTitle.classList.toggle('animation-start');
            }, 1000);
        }
    }
}