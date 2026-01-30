require('dotenv').config();
const express = require('express');
const cors = require('cors'); 
const { testConnection } = require('./src/config/database');
const Tarefa = require('./src/models/tarefa');
const tarefasRoutes = require('./src/routes/tarefasRoutes');

const app = express();
const PORT = process.env.PORT || 3000;


app.use(cors()); 
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

// Rota de teste (Health Check)
app.get('/', (req, res) => {
  res.json({ 
    mensagem: 'API To-Do List funcionando!',
    status: 'online',
    endpoints: {
      'POST /tarefas': 'Criar nova tarefa',
      'GET /tarefas': 'Listar todas as tarefas',
      'GET /tarefas/:id': 'Buscar tarefa por ID',
      'PATCH /tarefas/:id/status': 'Atualizar status (Drag & Drop)',
      'DELETE /tarefas/:id': 'Deletar tarefa'
    }
  });
});

// Rotas da API
app.use('/tarefas', tarefasRoutes);

// Tratamento de rota 404
app.use((req, res) => {
  res.status(404).json({ erro: 'Endpoint não encontrado!' });
});

// Inicialização do Banco e Servidor
async function iniciarServidor() {
  try {
    await testConnection();
    
    await Tarefa.sync();
    console.log('Banco de dados pronto!');
    
    app.listen(PORT, () => {
      console.log(`Servidor rodando em http://localhost:${PORT}`);
    }).on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(` Porta ${PORT} ocupada!`);
        console.error(` Dica: Feche o terminal anterior ou rode 'npx kill-port ${PORT}'`);
      } else {
        console.error(' Erro ao iniciar servidor:', err);
      }
    });
    
  } catch (error) {
    console.error(' Erro ao iniciar:', error);
    process.exit(1);
  }
}

iniciarServidor();