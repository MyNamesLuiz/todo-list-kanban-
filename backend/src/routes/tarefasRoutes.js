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
router.post('/', criarTarefa);           
router.get('/', listarTarefas);         
router.get('/:id', buscarTarefaPorId);   
router.put('/:id', atualizarTarefa);     
router.patch('/:id/status', atualizarStatus); 
router.delete('/:id', deletarTarefa);    

module.exports = router;