const Tarefa = require('../models/tarefa');

// Criar nova tarefa
async function criarTarefa(req, res) {
  try {
    const { titulo, descricao, status } = req.body;

    // Validar dados obrigatórios
    if (!titulo) {
      return res.status(400).json({
        erro: 'O título é obrigatório!'
      });
    }

    const novaTarefa = await Tarefa.create({
      titulo,
      descricao: descricao || '',
      status: status || 'a fazer'
    });

    res.status(201).json({
      mensagem: 'Tarefa criada com sucesso!',
      tarefa: novaTarefa
    });

  } catch (error) {
    console.error('Erro ao criar tarefa:', error);

    // Capturar erros de validação do Sequelize
    if (error.name === 'SequelizeValidationError') {
      const erros = error.errors.map(err => err.message);
      return res.status(400).json({ erros });
    }

    res.status(500).json({
      erro: 'Erro interno do servidor'
    });
  }
}

// Listar todas as tarefas
const listarTarefas = async (req, res) => {
  try {
    const tarefas = await Tarefa.findAll({
      order: [['createdAt', 'DESC']] // Ordenar por data de criação
    });

    res.json({
      quantidade: tarefas.length,
      tarefas
    });

  } catch (error) {
    console.error('Erro ao listar tarefas:', error);
    res.status(500).json({ 
      erro: 'Erro interno do servidor' 
    });
  }
};

// Buscar tarefa por ID
const buscarTarefaPorId = async (req, res) => {
  try {
    const { id } = req.params;

    const tarefa = await Tarefa.findByPk(id);

    if (!tarefa) {
      return res.status(404).json({ 
        erro: 'Tarefa não encontrada!' 
      });
    }

    res.json(tarefa);

  } catch (error) {
    console.error('Erro ao buscar tarefa:', error);
    res.status(500).json({ 
      erro: 'Erro interno do servidor' 
    });
  }
};

// Atualizar tarefa completamente (PUT)
const atualizarTarefa = async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, descricao, status } = req.body;

    const tarefa = await Tarefa.findByPk(id);

    if (!tarefa) {
      return res.status(404).json({ 
        erro: 'Tarefa não encontrada!' 
      });
    }

    // Validar dados obrigatórios
    if (!titulo) {
      return res.status(400).json({ 
        erro: 'O título é obrigatório!' 
      });
    }

// Atualizar todos os campos
    await tarefa.update({
      titulo,
      descricao: descricao || '',
      status: status || 'a fazer'
    });

    res.json({
      mensagem: 'Tarefa atualizada com sucesso!',
      tarefa
    });

  } catch (error) {
    console.error('Erro ao atualizar tarefa:', error);
    
    if (error.name === 'SequelizeValidationError') {
      const erros = error.errors.map(err => err.message);
      return res.status(400).json({ erros });
    }

    res.status(500).json({ 
      erro: 'Erro interno do servidor' 
    });
  }
};

// Atualizar apenas o status (PATCH)
const atualizarStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ 
        erro: 'O status é obrigatório!' 
      });
    }

    const tarefa = await Tarefa.findByPk(id);

    if (!tarefa) {
      return res.status(404).json({ 
        erro: 'Tarefa não encontrada!' 
      });
    }

// Atualizar apenas o status
    await tarefa.update({ status });

    res.json({
      mensagem: 'Status da tarefa atualizado com sucesso!',
      tarefa
    });

  } catch (error) {
    console.error('Erro ao atualizar status:', error);
    
    if (error.name === 'SequelizeValidationError') {
      const erros = error.errors.map(err => err.message);
      return res.status(400).json({ erros });
    }

    res.status(500).json({ 
      erro: 'Erro interno do servidor' 
    });
  }
};

// Deletar tarefa
const deletarTarefa = async (req, res) => {
  try {
    const { id } = req.params;

    const tarefa = await Tarefa.findByPk(id);

    if (!tarefa) {
      return res.status(404).json({ 
        erro: 'Tarefa não encontrada!' 
      });
    }

    await tarefa.destroy();

    res.status(204).send(); // 204 No Content - convenção REST

  } catch (error) {
    console.error('Erro ao deletar tarefa:', error);
    res.status(500).json({ 
      erro: 'Erro interno do servidor' 
    });
  }
};

module.exports = {
  criarTarefa,
  listarTarefas,
  buscarTarefaPorId,
  atualizarTarefa,
  atualizarStatus,
  deletarTarefa
};