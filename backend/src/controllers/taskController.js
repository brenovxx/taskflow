
const db = require("../database");

// Listar todas as tarefas
function getAllTasks(req, res) {
    const tasks = db.prepare("SELECT * FROM tasks").all();

    res.json(tasks.map(task => ({
        ...task,
        completed: Boolean(task.completed)
    })));
}

// Buscar tarefa pelo ID
function getTaskById(req, res) {
    const id = Number(req.params.id);

    const task = db.prepare(
        "SELECT * FROM tasks WHERE id = ?"
    ).get(id);

    if (!task) {
        return res.status(404).json({
            error: "Tarefa não encontrada"
        });
    }

    res.json({
        ...task,
        completed: Boolean(task.completed)
    });
}

// Criar tarefa
function createTask(req, res) {
    const { title, description } = req.body;

    if (!title || typeof title !== "string" || !title.trim()) {
        return res.status(400).json({
            error: "O título é obrigatório"
        });
    }

    const result = db.prepare(`
        INSERT INTO tasks (title, description, completed)
        VALUES (?, ?, 0)
    `).run(title.trim(), description || "");

    const newTask = db.prepare(
        "SELECT * FROM tasks WHERE id = ?"
    ).get(result.lastInsertRowid);

    res.status(201).json({
        ...newTask,
        completed: Boolean(newTask.completed)
    });
}

// Atualizar tarefa
function updateTask(req, res) {
    const id = Number(req.params.id);

    const task = db.prepare(
        "SELECT * FROM tasks WHERE id = ?"
    ).get(id);

    if (!task) {
        return res.status(404).json({
            error: "Tarefa não encontrada"
        });
    }

    const { title, description, completed } = req.body;

    const updatedTitle = title !== undefined ? title : task.title;
    const updatedDescription = description !== undefined
        ? description
        : task.description;
    const updatedCompleted = completed !== undefined
        ? (completed ? 1 : 0)
        : task.completed;

    if (typeof updatedTitle !== "string" || !updatedTitle.trim()) {
        return res.status(400).json({
            error: "O título não pode ficar vazio"
        });
    }

    db.prepare(`
        UPDATE tasks
        SET title = ?, description = ?, completed = ?
        WHERE id = ?
    `).run(
        updatedTitle.trim(),
        updatedDescription,
        updatedCompleted,
        id
    );

    const updatedTask = db.prepare(
        "SELECT * FROM tasks WHERE id = ?"
    ).get(id);

    res.json({
        ...updatedTask,
        completed: Boolean(updatedTask.completed)
    });
}

// Excluir tarefa
function deleteTask(req, res) {
    const id = Number(req.params.id);

    const result = db.prepare(
        "DELETE FROM tasks WHERE id = ?"
    ).run(id);

    if (result.changes === 0) {
        return res.status(404).json({
            error: "Tarefa não encontrada"
        });
    }

    res.json({
        message: "Tarefa excluída com sucesso"
    });
}

module.exports = {
    getAllTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask
};
