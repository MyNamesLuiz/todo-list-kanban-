require('dotenv').config();
const express = require('express');
const cors = require('cors'); 
const path = require('path');
const { testConnection } = require('./src/config/database');
const Tarefa = require('./src/models/tarefa');
const tarefasRoutes = require('./src/routes/tarefasRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors()); 
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, '../frontend')));

// Rota de teste 
app.get('/api', (req, res) => {
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

// Rota para servir o frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Inicialização do Banco e Servidor
async function iniciarServidor() {
  try {
    await testConnection();
    
    await Tarefa.sync();
    console.log('✅ Banco de dados pronto!');
    
    app.listen(PORT, '0.0.0.0', () => {
      console.log(` Servidor rodando em http://localhost:${PORT}`);
    }).on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`Porta ${PORT} ocupada!`);
        console.error(`Dica: Feche o terminal anterior ou rode 'npx kill-port ${PORT}'`);
      } else {
        console.error(' Erro ao iniciar servidor:', err);
      }
    });
    
  } catch (error) {
    console.error('Erro ao iniciar:', error);
    process.exit(1);
  }
}

iniciarServidor();