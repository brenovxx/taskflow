# TaskFlow — Gerenciador de Tarefas

O TaskFlow é uma aplicação web full stack desenvolvida para organizar tarefas e acompanhar atividades do dia a dia.

O projeto foi criado como parte dos meus estudos em desenvolvimento web, com foco na integração entre frontend, backend, API REST e banco de dados.

## Funcionalidades

- Criar tarefas com título e descrição.
- Listar todas as tarefas.
- Editar tarefas existentes.
- Excluir tarefas.
- Marcar tarefas como concluídas ou pendentes.
- Filtrar tarefas por status.
- Acompanhar estatísticas de tarefas.
- Armazenar dados utilizando SQLite.

## Tecnologias utilizadas

**Frontend**
- HTML5
- CSS3
- JavaScript

**Backend**
- Node.js
- Express.js
- SQLite
- better-sqlite3

## Estrutura do projeto

```text
taskflow/
├── backend/
│   └── src/
│       ├── controllers/
│       ├── routes/
│       ├── database.js
│       ├── server.js
│       └── package.json
│
├── frontend/
│   ├── css/
│   ├── js/
│   └── taskflow.html
│
└── README.md
```

## Como executar o projeto

### 1. Clonar o repositório

```bash
git clone https://github.com/brenovxx/taskflow.git
```

### 2. Instalar as dependências

```bash
cd taskflow/backend/src
npm install
```

### 3. Iniciar o servidor

```bash
node server.js
```

O backend será iniciado na porta 3000.

### 4. Abrir o frontend

Abra o arquivo `frontend/taskflow.html` utilizando o Live Server do VS Code.

## API REST

| Método | Rota | Descrição |
|---|---|---|
| GET | /tasks | Listar tarefas |
| GET | /tasks/:id | Buscar tarefa |
| POST | /tasks | Criar tarefa |
| PUT | /tasks/:id | Atualizar tarefa |
| DELETE | /tasks/:id | Excluir tarefa |

## Objetivo

Este projeto representa minha evolução prática em desenvolvimento de software, aplicando conceitos de JavaScript, desenvolvimento de APIs, integração entre sistemas e persistência de dados.

---

Desenvolvido por **Breno Ribeiro**.

[GitHub](https://github.com/brenovxx) · [Portfólio](https://brenovxx.github.io/portfolio/)