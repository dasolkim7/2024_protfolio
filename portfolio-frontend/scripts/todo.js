const host = "http://18.214.188.138:8082";
//const host = "";
const todosContainer = document.querySelector(".todos-container");

function getTodos() {
  axios
    .get(`${host}/todo`)
    .then((response) => {
      console.log(response.data);
      renderTodos(response.data.todos);
    })
    .catch((error) => [console.error("Error fetching todos:", error)]);
}

function fillTodoDiv(todoDiv, todo) {
  const dateP = document.createElement("p");
  dateP.textContent = `작성일: ${todo.savetime}`;
  todoDiv.appendChild(dateP);

  const hr1 = document.createElement("hr");
  todoDiv.appendChild(hr1);

  const nameP = document.createElement("p");
  nameP.textContent = `작성자: ${todo.name}`;
  todoDiv.appendChild(nameP);

  const hr2 = document.createElement("hr");
  todoDiv.appendChild(hr2);

  const contentP = document.createElement("p");
  contentP.innerHTML = todo.item.replace(/\n/g, "<br>"); // \n을 <br>로 치환하여 줄바꿈 처리
  todoDiv.appendChild(contentP);
}

function renderTodos(todos) {
  todosContainer.innerHTML = "";
  todos.forEach((todo) => {
    const todoDiv = document.createElement("div");
    todoDiv.classList.add("todo-item");
    fillTodoDiv(todoDiv, todo);
    todosContainer.appendChild(todoDiv);
    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("delete-btn");
    deleteBtn.textContent = "x";
    deleteBtn.addEventListener("click", function () {
      deleteTodo(todo.id);
    });
    todoDiv.appendChild(deleteBtn);
  });
}

window.addEventListener("DOMContentLoaded", function () {
  getTodos();
});

//const messageInput = document.querySelector(".todo-input");
const messageInput = document.querySelector("#message");
const nameInput = document.querySelector("#name");

/*
messageInput.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    addTodo();
  }
});
*/

function getCurrentTime() {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const day = String(now.getDate()).padStart(2, "0");

  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

function addTodo() {
  const message = messageInput.value.trim();
  const name = nameInput.value.trim();
  let todoData = {
    id: 0,
    savetime: getCurrentTime(),
    name: name,
    item: message,
  };
  if (message === "") return;
  if (name === "") return;

  axios
    .post(`${host}/todo`, todoData)
    .then((response) => {
      messageInput.value = "";
      nameInput.value = "";
      getTodos();
    })
    .catch((error) => {
      console.error("Error adding todo:", error);
    });
}

function deleteTodo(id) {
  axios
    .delete(`${host}/todo/${id}`)
    .then((response) => {
      getTodos();
    })
    .catch((error) => {
      console.error("Error deleting todo:", error);
    });
}
