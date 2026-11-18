
const express = require("express");

const router = express.Router();

const {
    getAllTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask
} = require("../controllers/taskController");

// Listar tarefas
router.get("/", getAllTasks);

// Buscar tarefa por ID
router.get("/:id", getTaskById);

// Criar tarefa
router.post("/", createTask);

// Atualizar tarefa
router.put("/:id", updateTask);

// Excluir tarefa
router.delete("/:id", deleteTask);

module.exports = router;
