# To-Do List Task

Sistema de gerenciamento de tarefas com drag & drop e organização por status.

## 🚀 Tecnologias

- **Backend:** Node.js, Express, Sequelize, SQLite
- **Frontend:** HTML, CSS, JavaScript (Vanilla)
- **Funcionalidades:** CRUD completo, Drag & Drop, Busca em tempo real

## 📦 Instalação

```bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env

# Iniciar servidor
npm start
```

## 🎯 Uso

1. Acesse `http://localhost:3000`
2. Crie tarefas com título e descrição
3. Arraste cards entre as colunas: **A Fazer**, **Em Andamento**, **Concluída**
4. Use a busca para filtrar tarefas

## 📡 API Endpoints

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/tarefas` | Criar tarefa |
| GET | `/tarefas` | Listar todas |
| GET | `/tarefas/:id` | Buscar por ID |
| PATCH | `/tarefas/:id/status` | Atualizar status |
| DELETE | `/tarefas/:id` | Deletar tarefa |

## 🗂️ Estrutura do Projeto

```
├── server.js              # Servidor Express
├── src/
│   ├── config/            # Configuração do banco
│   ├── models/            # Models Sequelize
│   └── routes/            # Rotas da API
├── index.html             # Interface do usuário
├── script.js              # Lógica frontend
└── style.css              # Estilos
```

## 📝 Licença

MIT
