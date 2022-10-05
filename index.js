let todoLists = new Array();
const todoTextInput = document.getElementById('todo-textbox');
const tasks = document.getElementById('tasks');
const taskCount = document.getElementById('task-count');
const addItemButton = document.getElementById('add-item-icon');
const listFilters = document.querySelectorAll('#tasks-filter > *');
const completeAllTaskBtn = document.getElementById('complete-all-task');
const clearCompletedBtn = document.getElementById('clear-completed');
const starsContainer = document.getElementById('star-container');

todoTextInput.focus();

completeAllTaskBtn.addEventListener('click', completeAllTask);
clearCompletedBtn.addEventListener('click', removeCompletedTaskItem);

tasks.addEventListener('click', removeTaskItem);
tasks.addEventListener('click', completeTask);

addItemButton.addEventListener('click', addToDoItemToList);
todoTextInput.addEventListener('keypress', addToDoItemToList);

for (let filter of listFilters) {
    filter.addEventListener('click', filterList);
}

filterListByName('all');

function removeTaskItem(e) {
    if (e.target !== undefined && e.srcElement.nodeName === 'I' && e.target.className.includes('remove-task')) {
        todoLists = todoLists.filter((item) => {
            return item.id !== Number(e.target.getAttribute('data-id'));
        });
    }
    renderToDoList();
}

function removeCompletedTaskItem() {
    todoLists = todoLists.filter((item) => {
        return !item.completed;
    });
    renderToDoList();
}

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

function filterList(e) {
    for (let filter of listFilters) {
        filter.style.fontWeight = 'normal';
        filter.style.color = '#8394ac';
    }
    e.target.style.fontWeight = 'bold';
    e.target.style.color = 'black';
    renderToDoList(e.target.getAttribute('data-name'));
}

function completeTask(e) {
    for (let item of todoLists) {
        if (item['id'] === Number(e.target.getAttribute('data-id'))) {
            item.completed = !item.completed;
        }
    }
    renderToDoList();
}

function completeAllTask() {
    for (let item of todoLists) {
        item.completed = true;
    }
    renderToDoList();
}

function renderToDoList(filterName) {
    tasks.innerHTML = '';

    let itemCount = 0;
    let uncompletedItem = true;

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

        tasks.append(taskItem);
        itemCount++;
        uncompletedItem = uncompletedItem && item['completed'];
    }

    //Update the task count in footer
    taskCount.textContent = itemCount;
    if (uncompletedItem && todoLists.length > 0) {
        showStars();
    }
}

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

    renderToDoList();
}

function showStars() {
    starsContainer.classList.add('start');

    setTimeout(() => {
        starsContainer.classList.remove('start');
    }, 5000);
}