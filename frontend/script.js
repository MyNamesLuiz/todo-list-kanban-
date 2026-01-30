
const API_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:3000/tarefas'
    : `${window.location.origin}/tarefas`;
let todasTarefas = []; 

document.addEventListener('DOMContentLoaded', () => {
    carregarTarefas();
    configurarEventos();
});

function configurarEventos() {
    const form = document.getElementById('form-tarefa');
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const inputTitulo = document.getElementById('titulo');
        const inputDescricao = document.getElementById('descricao');
        
        const titulo = inputTitulo.value.trim();
        const descricao = inputDescricao.value.trim(); 
        
        if (titulo) {
            
            await criarTarefa(titulo, descricao);
            
            inputTitulo.value = '';
            inputDescricao.value = ''; 
            inputTitulo.focus();
        }
    });
}


// Listar Tarefas 
async function carregarTarefas() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Erro ao buscar dados da API');
        
        const data = await response.json();
        
        todasTarefas = data.tarefas || []; 
        
        renderizarBoard(todasTarefas);
    } catch (error) {
        console.error('Erro na requisição GET:', error);
    }
}

// Criar Tarefa 
async function criarTarefa(titulo, descricao) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            
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

// Atualizar Status
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

// Deletar Tarefa 
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

function renderizarBoard(tarefas) {
    
    const colunas = {
        'a fazer': document.getElementById('list-a-fazer'),
        'em andamento': document.getElementById('list-em-andamento'),
        'concluída': document.getElementById('list-concluida')
    };

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

    // Atualiza os badges de contagem 
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

function filtrarTarefas() {
    const termo = document.getElementById('busca').value.toLowerCase();
    
    const tarefasFiltradas = todasTarefas.filter(t => 
        t.titulo.toLowerCase().includes(termo) || 
        (t.descricao && t.descricao.toLowerCase().includes(termo))
    );
    
    renderizarBoard(tarefasFiltradas);
}

function drag(ev) {
    ev.dataTransfer.setData("text/plain", ev.target.dataset.id);
    ev.target.style.opacity = '0.5';
}

function allowDrop(ev) {
    ev.preventDefault(); 
}

async function drop(ev, novoStatus) {
    ev.preventDefault();
    const id = ev.dataTransfer.getData("text/plain");
    
    
    const cardOriginal = document.querySelector(`.card[data-id='${id}']`);
    if (cardOriginal) cardOriginal.style.opacity = '1';

    // Dispara a atualização no servidor
    await atualizarStatusAPI(id, novoStatus);
}