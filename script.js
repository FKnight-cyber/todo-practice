class Board {
  id
  title
  tasks
  
  constructor(id, title, tasks) {
    this.id = id;
    this.title = title;
    this.tasks = tasks;
  }

  onDuplicateBoard(board) {
    const boardsContainer = document.querySelector(".boards");
    const newBoard = structuredClone(board);
    const lastBoardId = boards[boards.length - 1].id;
    newBoard.id = lastBoardId + 1;
    newBoard.title = `${newBoard.title} Copy`;
  
    const boardContainer = getBoardView(newBoard);
    boardsContainer.appendChild(boardContainer);
    boards.push(newBoard);
  }

  onBoardTitleClick(boardId) {
    const newTitle = prompt("Novo titulo do board");
    if (!newTitle) {
      alert("Insira o novo título!");
      return;
    }
  
    const boardTitleElement = document.querySelector(
      `.board-${boardId} .board-title`
    );
    boardTitleElement.textContent = newTitle;
  }

  onDeleteBoard(boardId) {
    boards = boards.filter((board) => board.id !== boardId);
  
    const boardContainer = document.querySelector(`[data-board-id="${boardId}"]`);
    boardContainer.remove();
  }

  onDeleteTask(boardId, taskId) {
    const board = boards.find((board) => board.id === boardId);
    board.tasks = board.tasks.filter((task) => task.id !== taskId);
  
    const taskContainer = document.querySelector(
      `[data-task-id="${taskId}"][data-board-id="${boardId}"]`
    );
    taskContainer.remove();
  }

  onAddBoard(newBoardTitle) {
    const lastBoardId = boards[boards.length - 1].id;
    const board = {
      id: lastBoardId + 1,
      title: newBoardTitle,
      tasks: [],
    };
    boards.push(board);
  
    const boardsContainer = document.querySelector(".boards");
    const boardContainer = getBoardView(board);
    boardsContainer.appendChild(boardContainer);
  }

  onAddTask(boardId, newTaskName) {
    const board = boards.find((board) => board.id === Number(boardId));
    const lastTaskId = board.tasks[board.tasks.length - 1]?.id;
    const task = {
      id: lastTaskId + 1,
      name: newTaskName,
      completed: false,
    };
    board.tasks.push(task);
  
    const tasksContainer = document.querySelector(
      `[data-board-id="${boardId}"] .tasks`
    );
    const taskContainer = getTaskView(Number(boardId), task);
    tasksContainer.appendChild(taskContainer);
  }

  onCompleteTask(boardId, taskId) {
    const board = boards.find((board) => board.id === Number(boardId));
  
    const completedTask = board.tasks.find((task) => task.id === Number(taskId));
    completedTask.completed = !completedTask.completed;
  
    const taskContainer = document.querySelector(
      `[data-task-id="${taskId}"][data-board-id="${boardId}"]`
    );
    taskContainer.classList.toggle("completed");
  }
}

function handleNewTaskInputKeypress(e) {
  if (e.key === "Enter") {
    boardPessoal.onAddTask(e.target.dataset.boardId, e.target.value);
    e.target.value = "";
  }
}

function handleNewBoardInputKeypress(e) {
  if (e.key === "Enter") {
    boardPessoal.onAddBoard(e.target.value);
    e.target.value = "";
  }
}

function getTaskView(boardId, task) {
  const taskContainer = document.createElement("li");
  taskContainer.classList.add("task");
  taskContainer.dataset.taskId = task.id;
  taskContainer.dataset.boardId = boardId;
  if (task.completed) {
    taskContainer.classList.add("completed");
  }

  const taskCheckbox = document.createElement("input");
  taskCheckbox.id = `checkbox-${task.id}-${Date.now()}`;
  taskCheckbox.classList.add("checkbox");
  taskCheckbox.type = "checkbox";
  taskCheckbox.checked = task.completed;
  taskCheckbox.addEventListener("click", () =>
    boardPessoal.onCompleteTask(boardId, task.id)
  );
  taskContainer.appendChild(taskCheckbox);

  const taskName = document.createElement("label");
  taskName.classList.add("task-name");
  taskName.textContent = task.name;
  taskName.htmlFor = taskCheckbox.id;
  taskContainer.appendChild(taskName);

  const deleteButton = document.createElement("button");
  deleteButton.classList.add("delete-button");
  deleteButton.textContent = "X";
  deleteButton.addEventListener("click", () => boardPessoal.onDeleteTask(boardId, task.id));
  taskContainer.appendChild(deleteButton);

  return taskContainer;
}

function getBoardView(board) {
  const boardContainer = document.createElement("div");
  boardContainer.classList.add("board");
  boardContainer.dataset.boardId = board.id;

  const htmlRow = document.createElement("div");
  htmlRow.classList.add("row");

  const duplicateButton = document.createElement("button");
  duplicateButton.classList.add("duplicate-button");
  duplicateButton.textContent = "Duplicate board";
  duplicateButton.addEventListener("click", () => boardPessoal.onDuplicateBoard(board));
  htmlRow.appendChild(duplicateButton);

  const deleteButton = document.createElement("button");
  deleteButton.classList.add("delete-button");
  deleteButton.textContent = "X";
  deleteButton.addEventListener("click", () => boardPessoal.onDeleteBoard(board.id));
  htmlRow.appendChild(deleteButton);

  boardContainer.appendChild(htmlRow);

  const boardTitle = document.createElement("p");
  boardTitle.classList.add("board-title");
  boardTitle.textContent = board.title;
  boardTitle.addEventListener("click", () => boardPessoal.onBoardTitleClick(board.id));
  boardContainer.appendChild(boardTitle);

  const tasksContainer = document.createElement("ul");
  tasksContainer.classList.add("tasks");
  boardContainer.appendChild(tasksContainer);

  board.tasks.forEach((task) => {
    const taskContainer = getTaskView(board.id, task);
    tasksContainer.appendChild(taskContainer);
  });

  const newTaskInput = document.createElement("input");
  newTaskInput.dataset.boardId = board.id;
  newTaskInput.classList.add("new-task-input");
  newTaskInput.type = "text";
  newTaskInput.placeholder = "Nova tarefa";
  newTaskInput.addEventListener("keypress", handleNewTaskInputKeypress);
  boardContainer.appendChild(newTaskInput);

  return boardContainer;
}

const boardPessoal = new Board(
  1,
  "Title",
  [
    { id: 1, name: "tarefa 1", completed: false },
    { id: 2, name: "tarefa 2", completed: false },
    { id: 3, name: "tarefa 3", completed: true },
    { id: 4, name: "tarefa 4", completed: false },
    { id: 5, name: "tarefa 5", completed: true },
  ]
);

let boards = [boardPessoal];

function renderizarBoards(boards) {
  const boardsContainer = document.querySelector(".boards");

  boards.forEach((board) => {
    const boardContainer = getBoardView(board);

    boardsContainer.appendChild(boardContainer);
  });
}
renderizarBoards(boards);

const newBoardInput = document.querySelector(".new-board-input");
newBoardInput.addEventListener("keypress", handleNewBoardInputKeypress);
