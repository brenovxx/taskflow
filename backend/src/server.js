
const express = require("express");
const taskRoutes = require("./routes/taskRoutes");

const app = express();
const PORT = 3000;

// Permite receber JSON
app.use(express.json());

// Permite a comunicação com o frontend
const allowedOrigins = [
    "http://127.0.0.1:5500",
    "http://localhost:5500"
];

app.use((req, res, next) => {
    const origin = req.headers.origin;

    if (allowedOrigins.includes(origin)) {
        res.setHeader("Access-Control-Allow-Origin", origin);
    }

    res.setHeader("Vary", "Origin");
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, OPTIONS"
    );
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
        return res.sendStatus(204);
    }

    next();
});

// Rota inicial
app.get("/", (req, res) => {
    res.json({
        message: "Bem-vindo à TaskFlow API!",
        status: "online"
    });
});

// Rotas de tarefas
app.use("/tasks", taskRoutes);

// Inicializar servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
