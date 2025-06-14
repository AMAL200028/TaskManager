document.addEventListener("DOMContentLoaded", () => {
    const taskForm = document.getElementById("task-form");
    const taskInput = document.getElementById("task-input");
    const taskList = document.getElementById("task-list");
    const errorMessage = document.getElementById("error-message");
  
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    let currentFilter = "all";
  
    function saveTasks() {
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }
  
    function renderTasks(filter = "all") {
      taskList.innerHTML = "";
  
      const filtered = tasks.filter(task =>
        filter === "all" ? true :
        filter === "completed" ? task.completed :
        !task.completed
      );
  
      if (filtered.length === 0) {
        taskList.innerHTML = "<p style='text-align:center; opacity:0.7;'>📭 No tasks found</p>";
        return;
      }
  
      filtered.forEach(task => {
        const card = document.createElement("div");
        card.className = "task-card" + (task.completed ? " completed" : "");
        card.innerHTML = `
          <h3>${task.title}</h3>
          <p>Status: ${task.completed ? "✅ Completed" : "⏳ Pending"}</p>
          <div class="task-actions">
            <button onclick="toggleTask(${task.id})">${task.completed ? "Undo" : "✔ Complete"}</button>
            <button onclick="deleteTask(${task.id})" style="background:#f44336;">🗑 Delete</button>
          </div>
        `;
        taskList.appendChild(card);
      });
    }
  
    window.toggleTask = id => {
      const index = tasks.findIndex(t => t.id === id);
      tasks[index].completed = !tasks[index].completed;
      saveTasks();
      renderTasks(currentFilter);
    };
  
    window.deleteTask = id => {
      tasks = tasks.filter(t => t.id !== id);
      saveTasks();
      renderTasks(currentFilter);
    };
  
    taskForm.addEventListener("submit", e => {
      e.preventDefault();
      const title = taskInput.value.trim();
  
      if (!title) {
        errorMessage.textContent = "⚠️ Task title is required!";
        taskInput.classList.add("error");
        return;
      }
  
      tasks.push({
        id: Date.now(),
        title,
        completed: false
      });
  
      taskInput.value = "";
      errorMessage.textContent = "";
      taskInput.classList.remove("error");
      saveTasks();
      renderTasks(currentFilter);
    });
  
    document.querySelectorAll(".filters button").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".filters button").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        currentFilter = btn.getAttribute("data-filter");
        renderTasks(currentFilter);
      });
    });
  

    if (tasks.length === 0) {
      fetch("https://jsonplaceholder.typicode.com/todos?_limit=5")
        .then(res => res.json())
        .then(data => {
          tasks = data.map(todo => ({
            id: todo.id,
            title: todo.title,
            completed: todo.completed
          }));
          saveTasks();
          renderTasks();
        });
    } else {
      renderTasks();
    }
  });
  