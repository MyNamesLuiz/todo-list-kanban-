const { sequelize } = require('../config/database');
const { DataTypes } = require('sequelize');

const Tarefa = sequelize.define('tarefa', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  titulo: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'O título não pode estar vazio!'
      },
      len: {
        args: [1, 100],
        msg: 'O título deve ter entre 1 e 100 caracteres!'
      }
    }
  },
  descricao: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('a fazer', 'em andamento', 'concluída'),
    defaultValue: 'a fazer',
    validate: {
      isIn: {
        args: [['a fazer', 'em andamento', 'concluída']],
        msg: 'Status deve ser: a fazer, em andamento ou concluída!'
      }
    }
  }
}, {
  tableName: 'tarefas',
  timestamps: true
});

module.exports = Tarefa;