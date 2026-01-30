const express = require('express');
const router = express.Router();

// Importar controlador
const {
  criarTarefa,
  listarTarefas,
  buscarTarefaPorId,
  atualizarTarefa,
  atualizarStatus,
  deletarTarefa
} = require('../controllers/tarefasController');

// Definir rotas
router.post('/', criarTarefa);           // POST /tarefas
router.get('/', listarTarefas);          // GET /tarefas
router.get('/:id', buscarTarefaPorId);   // GET /tarefas/:id
router.put('/:id', atualizarTarefa);     // PUT /tarefas/:id
router.patch('/:id/status', atualizarStatus); // PATCH /tarefas/:id/status
router.delete('/:id', deletarTarefa);    // DELETE /tarefas/:id

module.exports = router;