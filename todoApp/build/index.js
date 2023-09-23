import fs from "fs";

let tasks = [];

// Function to read tasks
function readTasks() {
  fs.readFile("tasks.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    tasks = JSON.parse(data);
  });
}

// Call readTasks to initialize tasks
readTasks();

// Function to write tasks
function writeTasks(tasks) {
  fs.writeFile("tasks.json", JSON.stringify(tasks), (err) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log("Tasks written successfully");
  });
}

function createTask(taskName, expectedDuration, taskDescription) {
  // Check if a task with the same name already exists
  let existingTask = tasks.find((task) => task.taskName === taskName);

  if (existingTask) {
    // If it does, display a popup message and return
    alert(
      "A task with this name already exists. Please choose a different name."
    );
    return;
  }

  // If not, create the new task as usual
  let task = new Task(taskName, expectedDuration, taskDescription);

  tasks.push(task);

  writeTasks(tasks); // Call the writeTasks function you defined earlier
  readTasks();
}

function deleteTask(taskName) {
  let taskIndex = tasks.findIndex((task) => task.taskName === taskName);

  if (taskIndex === -1) {
    alert("No task with this name exists.");
    return;
  }

  tasks.splice(taskIndex, 1);

  writeTasks(tasks);
  readTasks();
}

const createTaskForm = `
<form id="createTaskForm">
  <label for="createTaskName">Task Name:</label><br>
  <input type="text" id="createTaskName" name="taskName"><br>
  <label for="createExpectedDuration">Expected Duration:</label><br>
  <input type="text" id="createExpectedDuration" name="expectedDuration"><br>
  <label for="createTaskDescription">Task Description:</label><br>
  <input type="text" id="createTaskDescription" name="taskDescription"><br>
  <label for="createTaskState">Task State:</label><br>
  <select id="createTaskState" name="taskState">
    <option value="pending">Pending</option>
    <option value="inProgress">In Progress</option>
    <option value="completed">Completed</option>
  </select><br>
  <input type="submit" value="Create Task">
</form>
`;

const updateTaskForm = `
<form id="updateTaskForm">
  <label for="updateTaskName">New Task Name:</label><br>
  <input type="text" id="updateTaskName" name="taskName"><br>
  <label for="updateExpectedDuration">New Expected Duration:</label><br>
  <input type="text" id="updateExpectedDuration" name="expectedDuration"><br>
  <label for="updateTaskDescription">New Task Description:</label><br>
  <input type="text" id="updateTaskDescription" name="taskDescription"><br>
  <label for="updateTaskState">New Task State:</label><br>
  <select id="updateTaskState" name="taskState">
    <option value="pending">Pending</option>
    <option value="inProgress">In Progress</option>
    <option value="completed">Completed</option>
  </select><br>
  <input type="submit" value="Update Task">
</form>

`;

const ConfirmDeleteInterface = `
  <div id="confirmDelete">
    <h2>Are you sure you want to delete this task?</h2>
    <button id="yesDelete">Yes, delete</button>
    <button id="noDelete">No, don't delete</button>
  </div>
`;

const viewTaskInterface = `
  <div id="viewTasks">
    <h2>View Tasks</h2>
    <div id="pendingContainer">
      <h3>Pending Tasks</h3>
    </div>
    <div id="startedContainer">
      <h3>Started Tasks</h3>
    </div>
    <div id="completedContainer">
      <h3>Completed Tasks</h3>
    </div>
  </div>
`;

function updateViewTasks() {
  // Get the containers for each task state
  let pendingContainer = document.getElementById("pendingContainer");
  let startedContainer = document.getElementById("startedContainer");
  let completedContainer = document.getElementById("completedContainer");

  // Clear the containers
  pendingContainer.innerHTML = "";
  startedContainer.innerHTML = "";
  completedContainer.innerHTML = "";

  // Filter the tasks based on their state and append them to the appropriate container
  for (let task of tasks) {
    let taskElement = document.createElement("p");
    taskElement.textContent = task.taskName;

    if (task.state === "pending") {
      pendingContainer.appendChild(taskElement);
    } else if (task.state === "started") {
      startedContainer.appendChild(taskElement);
    } else if (task.state === "completed") {
      completedContainer.appendChild(taskElement);
    }
  }
}

const mode = "view";
const selectedTaskName = "";

function updateMain() {
  let mainDiv = document.getElementById("main");
  mainDiv.innerHTML = "";

  switch (mode) {
    case "create":
      // Display the create task form
      mainDiv.innerHTML = createTaskForm;
      break;
    case "update":
      // Display the update task form
      mainDiv.innerHTML = updateTaskForm;
      break;
    case "view":
      mainDiv.innerHTML = viewTaskInterface;
      break;
    case "delete":
      // Display the delete task form
      mainDiv.innerHTML = ConfirmDeleteInterface;
      break;
  }
}

// Add event listeners to the create task form
document
  .getElementById("createTaskForm")
  .addEventListener("submit", function (event) {
    // Prevent the form from being submitted normally
    event.preventDefault();

    // Get the data from the form
    let taskName = document.getElementById("createTaskName").value;
    let expectedDuration = document.getElementById(
      "createExpectedDuration"
    ).value;
    let taskDescription = document.getElementById(
      "createTaskDescription"
    ).value;

    // Call the createTask function
    createTask(taskName, expectedDuration, taskDescription);

    // Update the main section
    updateMain();
  });

// Add event listeners to the update task form
document
  .getElementById("updateTaskForm")
  .addEventListener("submit", function (event) {
    // Prevent the form from being submitted normally
    event.preventDefault();

    // Get the data from the form
    let taskName = document.getElementById("updateTaskName").value;
    let expectedDuration = document.getElementById(
      "updateExpectedDuration"
    ).value;
    let taskDescription = document.getElementById(
      "updateTaskDescription"
    ).value;

    // Call an updateTask function (you'll need to define this)
    updateTask(taskName, expectedDuration, taskDescription);

    // Update the main section
    updateMain();
  });

// Add event listeners to the delete buttons
document.getElementById("yesDelete").addEventListener("click", function () {
  // Call the deleteTask function
  deleteTask(selectedTaskName);

  // Update the main section
  updateMain();
});

document.getElementById("noDelete").addEventListener("click", function () {
  // If "No, don't delete" is clicked, simply update the main section to exit delete mode
  updateMain();
});

window.onload = function () {
  // Add event listeners here
  // Add event listeners to the sidebar buttons
  document
    .getElementById("createTaskButton")
    .addEventListener("click", function () {
      mode = "create";
      updateMain();
    });

  document
    .getElementById("updateTaskButton")
    .addEventListener("click", function () {
      mode = "update";
      updateMain();
    });

  document
    .getElementById("deleteTaskButton")
    .addEventListener("click", function () {
      mode = "delete";
      updateMain();
    });

  document
    .getElementById("readCreatedTasksButton")
    .addEventListener("click", function () {
      mode = "view";
      updateMain();
    });
};
