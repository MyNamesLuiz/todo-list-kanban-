/**
 * Configurações e Estado Global
 */
const API_URL = 'http://localhost:3000/tarefas';
let todasTarefas = []; // Cache local para permitir busca sem novas requisições

/**
 * Inicialização
 */
document.addEventListener('DOMContentLoaded', () => {
    carregarTarefas();
    configurarEventos();
});

function configurarEventos() {
    const form = document.getElementById('form-tarefa');
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const inputTitulo = document.getElementById('titulo');
        const inputDescricao = document.getElementById('descricao'); // Captura o campo descrição
        
        const titulo = inputTitulo.value.trim();
        const descricao = inputDescricao.value.trim(); // Pega o valor digitado
        
        if (titulo) {
            // Passa os dois valores para a função
            await criarTarefa(titulo, descricao);
            
            inputTitulo.value = '';
            inputDescricao.value = ''; // Limpa o campo após criar
            inputTitulo.focus();
        }
    });
}

/**
 * Funções de Comunicação com a API (Fetch)
 */

// Listar Tarefas (GET)
async function carregarTarefas() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Erro ao buscar dados da API');
        
        const data = await response.json();
        // O backend retorna um objeto: { quantidade: X, tarefas: [...] }
        todasTarefas = data.tarefas || []; 
        
        renderizarBoard(todasTarefas);
    } catch (error) {
        console.error('Erro na requisição GET:', error);
    }
}

// Criar Tarefa (POST)
async function criarTarefa(titulo, descricao) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            // Enviando a descrição no corpo da requisição
            body: JSON.stringify({ 
                titulo: titulo,
                descricao: descricao, 
                status: 'a fazer'
            })
        });
        
        if (!response.ok) throw new Error('Erro ao criar tarefa');
        
        await carregarTarefas();
    } catch (error) {
        console.error('Erro:', error);
        alert('Não foi possível conectar ao servidor. Verifique se o Back-end está rodando!');
    }
}

// Atualizar Status (PATCH)
async function atualizarStatusAPI(id, novoStatus) {
    try {
        const response = await fetch(`${API_URL}/${id}/status`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: novoStatus })
        });

        if (response.ok) {
            await carregarTarefas();
        } else {
            const erro = await response.json();
            alert(`Erro: ${erro.erro || 'Não foi possível mover a tarefa'}`);
        }
    } catch (error) {
        console.error('Erro na requisição PATCH:', error);
    }
}

// Deletar Tarefa (DELETE)
async function deletarTarefa(id) {
    if (!confirm("Deseja realmente excluir esta tarefa?")) return;

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });

        if (response.status === 204 || response.ok) {
            await carregarTarefas();
        }
    } catch (error) {
        console.error('Erro na requisição DELETE:', error);
    }
}

/**
 * Lógica de Renderização e UI
 */

function renderizarBoard(tarefas) {
    // Referências das colunas no HTML
    const colunas = {
        'a fazer': document.getElementById('list-a-fazer'),
        'em andamento': document.getElementById('list-em-andamento'),
        'concluída': document.getElementById('list-concluida')
    };

    // Limpar todas as listas antes de renderizar
    Object.values(colunas).forEach(col => col.innerHTML = '');

    // Contadores
    const counts = { 'a fazer': 0, 'em andamento': 0, 'concluída': 0 };

    tarefas.forEach(tarefa => {
        const card = criarCardHTML(tarefa);
        const listaDestino = colunas[tarefa.status];

        if (listaDestino) {
            listaDestino.appendChild(card);
            counts[tarefa.status]++;
        }
    });

    // Atualiza os badges de contagem (IDs: count-todo, count-doing, count-done)
    document.getElementById('count-todo').innerText = counts['a fazer'];
    document.getElementById('count-doing').innerText = counts['em andamento'];
    document.getElementById('count-done').innerText = counts['concluída'];
}

function criarCardHTML(tarefa) {
    const div = document.createElement('div');
    div.className = 'card';
    div.setAttribute('draggable', 'true');
    div.setAttribute('ondragstart', 'drag(event)');
    div.dataset.id = tarefa.id;
    div.dataset.status = tarefa.status;

    div.innerHTML = `
        <div class="card-content">
            <strong>${tarefa.titulo}</strong>
            <p>${tarefa.descricao || 'Sem descrição'}</p>
        </div>
        <div class="card-actions">
            <button class="btn-delete" onclick="deletarTarefa(${tarefa.id})" title="Excluir">
                <i class="fa-regular fa-trash-can"></i>
            </button>
        </div>
    `;
    return div;
}

/**
 * Mecanismo de Busca (Filtro local)
 */
function filtrarTarefas() {
    const termo = document.getElementById('busca').value.toLowerCase();
    
    const tarefasFiltradas = todasTarefas.filter(t => 
        t.titulo.toLowerCase().includes(termo) || 
        (t.descricao && t.descricao.toLowerCase().includes(termo))
    );
    
    renderizarBoard(tarefasFiltradas);
}

/**
 * Handlers de Arrastar e Soltar (Drag & Drop API)
 */
function drag(ev) {
    ev.dataTransfer.setData("text/plain", ev.target.dataset.id);
    ev.target.style.opacity = '0.5';
}

function allowDrop(ev) {
    ev.preventDefault(); // Necessário para permitir o drop
}

async function drop(ev, novoStatus) {
    ev.preventDefault();
    const id = ev.dataTransfer.getData("text/plain");
    
    // Remove efeito visual do card caso ele ainda esteja no DOM
    const cardOriginal = document.querySelector(`.card[data-id='${id}']`);
    if (cardOriginal) cardOriginal.style.opacity = '1';

    // Dispara a atualização no servidor
    await atualizarStatusAPI(id, novoStatus);
}