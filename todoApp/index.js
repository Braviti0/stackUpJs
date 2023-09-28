// Define a class to represent tasks
class Task {
  constructor(name, description) {
    this.name = name;
    this.description = description;
    this.state = "pending"; // Default state is 'pending'
  }

  // method called updateTaskState uses switch statement to change the state of the task to either pending, started or completed
    updateTaskState(state) {
        switch (state) {
        case "pending":
            this.state = "pending";
            break;
        case "started":
            this.state = "started";
            break;
        case "completed":
            this.state = "completed";
            break;
        default:
            alert("Invalid state");
        }
    }
}

// Initialize an empty array to store tasks
const tasks = [];


// Function to create a new task and add it to the tasks array
function createTaskUI() {
    const formHtml = `
        <h2 id="createTaskTitle">Over here You can create a new task which you will update the progress later</h2>
        <form id="createTaskForm" onSubmit="event.preventDefault(); 
                                        const taskName = document.getElementById('taskName').value;
                                        const taskDescription = document.getElementById('taskDescription').value;
                                        createTask(taskName, taskDescription);">
            <label for="taskName">Task Name:</label>
            <input type="text" id="taskName" required>
            <br>
            <label for="taskDescription">Task Description:</label>
            <textarea type="text" id="taskDescription" required></textarea>
            <br>
            <button type="submit">Create Task</button>
        </form>
`;

  modifyMain(formHtml);

}

function createTask(name, description) {

    // make sure the task name is not empty
    if (name === "") {
        alert("Please enter a task name");
        return;
    }

    if (description === "") {
        alert("Please enter a task description");
        return;
    }

    // make sure the task name is not already in use

    if (tasks.find(task => task.name === name)) {
        alert("Task name already in use");
        return;
    }


  // Create a new task object
  const task = new Task(name, description);

  // Add the task to the tasks array
  tasks.push(task);

  // Call the viewTasks function to display the tasks
  viewTasksUI();
}





// Function to display task names in the "main" component
function viewTasksUI() {

    // group tasks by state
    const pendingTasks = tasks.filter(task => task.state === "pending");
    const startedTasks = tasks.filter(task => task.state === "started");
    const completedTasks = tasks.filter(task => task.state === "completed");

    // display tasks in 3 containers for flexbox styling, one for each state, each task is a button that calls the viewTask function when clicked
    const taskButtons = [
        "<div class= 'mainTaskContainer'>",
        "<div class='taskContainer'>",
        "<div class='taskState'>Pending</div>",
        pendingTasks.map(task => `<button class='taskButton' onclick="viewTask('${task.name}')">${task.name}</button>`).join("<br>"),
        "</div>",
        "<div class='taskContainer'>",
        "<div class='taskState'>Started</div>",
        startedTasks.map(task => `<button class='taskButton' onclick="viewTask('${task.name}')">${task.name}</button>`).join("<br>"),
        "</div>",
        "<div class='taskContainer'>",
        "<div class='taskState'>Completed</div>",
        completedTasks.map(task => `<button class='taskButton' onclick="viewTask('${task.name}')">${task.name}</button>`).join("<br>"),
        "</div>",
        "</div>",
    ];

    // Join the taskButtons array elements into a single string
    const tasksHtml = taskButtons.join("");

    // Modify the "main" component
    modifyMain(tasksHtml);
}



function viewTask(taskName) {
    // Find the task with the given name
    const task = tasks.find(task => task.name === taskName);

    // Define the HTML template for displaying a task
    // redefine and add classes for styling
    const taskHtml = `
        <div class="task">
            <div class="taskName">${task.name}</div>
            <div class="taskDescription">${task.description}</div>
            <div class="taskState">${task.state}</div>
            <div class="taskControls">
                <button onclick="updateTask('${task.name}', "start")">Start Task</button>
                <button onclick="updateTask('${task.name}', "complete")">Complete Task</button>
                <button onclick="updateTask('${task.name}', "delete")">Delete Task</button>
            </div>
        </div>
        `;

    // Modify the "main" component
    modifyMain(taskHtml);
}

// Function to update the state of a task
function updateTask(taskName, action) {
    // Find the task with the given name
    const task = tasks.find(task => task.name === taskName);

    switch (action) {
        case "start":
            task.updateTaskState("started");
            break;
        case "complete":
            task.updateTaskState("completed");
            break;
        case "delete":
            // Find the index of the task
            const index = tasks.indexOf(task);

            // Delete the task from the tasks array
            tasks.splice(index, 1);
            break;
        default:
            alert("Invalid action");
    }

    // Call the viewTasks function to display the tasks
    viewTasksUI();
}


// Function to modify the content of the element with id "main"
function modifyMain(newContent) {
    try {
        // Get the reference to the element with id "main"
        const mainElement = document.getElementById("main");

        // Set the content of the element using innerHTML
        mainElement.innerHTML = newContent;
    } catch (error) {
        // Display an alert with the error message
        alert("An error occurred: " + error.message);
    }
}


document.addEventListener("DOMContentLoaded", function () {
  viewTasksUI();
});

