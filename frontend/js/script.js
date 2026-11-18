
const API_URL = "http://localhost:3000/tasks";

const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const descriptionInput = document.getElementById("descriptionInput");

const taskList = document.getElementById("taskList");
const sidebarTaskList = document.getElementById("sidebarTaskList");

const totalTasks = document.getElementById("totalTasks");
const pendingTasks = document.getElementById("pendingTasks");
const completedTasks = document.getElementById("completedTasks");

const filterButtons = document.querySelectorAll(".filter-btn");

let currentFilter = "all";

const editModal = document.getElementById("editModal");
const editForm = document.getElementById("editForm");
const editTitle = document.getElementById("editTitle");
const editDescription = document.getElementById("editDescription");
const closeModal = document.getElementById("closeModal");
const cancelEdit = document.getElementById("cancelEdit");

let editingTaskId = null;


// BUSCAR TAREFAS NA API

async function loadTasks() {
    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Não foi possível buscar as tarefas.");
        }

        const tasks = await response.json();

        renderTasks(tasks);

    } catch (error) {
        console.error("Erro:", error);
        taskList.textContent = "Erro ao carregar tarefas. Verifique se o servidor está ligado.";
    }
}


// MOSTRAR TAREFAS NA TELA

function renderTasks(tasks) {
    taskList.innerHTML = "";
    sidebarTaskList.innerHTML = "";

    totalTasks.textContent = tasks.length;

    pendingTasks.textContent =
        tasks.filter(task => !task.completed).length;

    completedTasks.textContent =
        tasks.filter(task => task.completed).length;

    tasks.forEach(task => {
        const sidebarItem = document.createElement("p");
        sidebarItem.textContent = task.title;
        sidebarTaskList.appendChild(sidebarItem);
    });

    let filteredTasks = tasks;

    if (currentFilter === "pending") {
        filteredTasks = tasks.filter(task => !task.completed);
    }

    if (currentFilter === "completed") {
        filteredTasks = tasks.filter(task => task.completed);
    }

    if (filteredTasks.length === 0) {
        const emptyMessage = document.createElement("p");
        emptyMessage.classList.add("empty-state");

        if (tasks.length === 0) {
            emptyMessage.textContent = "Nenhuma tarefa cadastrada ainda.";
        } else {
            emptyMessage.textContent = "Nenhuma tarefa encontrada neste filtro.";
        }

        taskList.appendChild(emptyMessage);
        return;
    }

    filteredTasks.forEach(task => {
        const taskElement = document.createElement("article");
        taskElement.classList.add("task-item");

        const taskInfo = document.createElement("div");
        taskInfo.classList.add("task-info");

        const title = document.createElement("h3");
        title.textContent = task.title;

        const description = document.createElement("p");
        description.textContent = task.description || "Sem descrição";

        const status = document.createElement("span");
        status.textContent = task.completed ? "Concluída" : "Pendente";

        taskInfo.append(title, description, status);

        const actions = document.createElement("div");
        actions.classList.add("task-actions");

        const completeButton = document.createElement("button");
        completeButton.textContent = task.completed ? "Reabrir" : "Concluir";

        completeButton.addEventListener("click", () => {
            updateTask(task.id, {
                completed: !task.completed
            });
        });

        const editButton = document.createElement("button");
        editButton.textContent = "Editar";

        editButton.addEventListener("click", () => {
            editTask(task);
        });

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Excluir";

        deleteButton.addEventListener("click", () => {
            deleteTask(task.id);
        });

        actions.append(completeButton, editButton, deleteButton);
        taskElement.append(taskInfo, actions);
        taskList.appendChild(taskElement);
    });
}


// FILTRAR TAREFAS

console.log("Botões de filtro encontrados:", filterButtons.length);

filterButtons.forEach(button => {
    button.type = "button";

    button.addEventListener("click", (event) => {
        event.preventDefault();

        console.log("Filtro clicado:", button.dataset.filter);

        currentFilter = button.dataset.filter;

        filterButtons.forEach(btn => {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        loadTasks();
    });
});


// CADASTRAR TAREFA

taskForm.addEventListener("submit", async function(event) {
    event.preventDefault();

    const title = taskInput.value.trim();
    const description = descriptionInput.value.trim();

    if (!title) {
        alert("Digite o título da tarefa.");
        return;
    }

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title,
                description
            })
        });

        if (!response.ok) {
            throw new Error("Não foi possível cadastrar a tarefa.");
        }

        taskForm.reset();
        loadTasks();

    } catch (error) {
        console.error("Erro:", error);
        alert("Erro ao cadastrar tarefa.");
    }
});


// ATUALIZAR TAREFA

async function updateTask(id, changes) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(changes)
        });

        if (!response.ok) {
            throw new Error("Não foi possível atualizar a tarefa.");
        }

        loadTasks();

    } catch (error) {
        console.error("Erro:", error);
        alert("Erro ao atualizar tarefa.");
    }
}


// ABRIR MODAL DE EDIÇÃO

function editTask(task) {
    editingTaskId = task.id;

    editTitle.value = task.title;
    editDescription.value = task.description || "";

    editModal.classList.add("active");
    editTitle.focus();
}


// FECHAR MODAL

function closeEditModal() {
    editModal.classList.remove("active");
    editForm.reset();
    editingTaskId = null;
}

closeModal.addEventListener("click", closeEditModal);
cancelEdit.addEventListener("click", closeEditModal);

editModal.addEventListener("click", function(event) {
    if (event.target === editModal) {
        closeEditModal();
    }
});

document.addEventListener("keydown", function(event) {
    if (event.key === "Escape" && editModal.classList.contains("active")) {
        closeEditModal();
    }
});


// SALVAR EDIÇÃO

editForm.addEventListener("submit", async function(event) {
    event.preventDefault();

    const title = editTitle.value.trim();
    const description = editDescription.value.trim();

    if (!title) {
        alert("O título é obrigatório.");
        return;
    }

    if (editingTaskId === null) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/${editingTaskId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title,
                description
            })
        });

        if (!response.ok) {
            throw new Error("Não foi possível editar a tarefa.");
        }

        closeEditModal();
        loadTasks();

    } catch (error) {
        console.error("Erro:", error);
        alert("Erro ao salvar alterações.");
    }
});


// EXCLUIR TAREFA

async function deleteTask(id) {
    const confirmation = confirm("Tem certeza que deseja excluir esta tarefa?");

    if (!confirmation) return;

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE"
        });

        if (!response.ok) {
            throw new Error("Não foi possível excluir a tarefa.");
        }

        loadTasks();

    } catch (error) {
        console.error("Erro:", error);
        alert("Erro ao excluir tarefa.");
    }
}


// CARREGAR TAREFAS

loadTasks();
