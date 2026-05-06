let carrinho = [];
let usuarioLogado = null;

// --- INICIALIZAÇÃO ---
document.addEventListener('DOMContentLoaded', () => {
    carregarProdutos();
    atualizarInterfaceLogin();
});

// --- AUTENTICAÇÃO REAL ---
async function realizarLogin() {
    const username = prompt("Usuário:");
    const password = prompt("Senha:");

    if (!username || !password) return;

    try {
        const res = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await res.json();

        if (data.success) {
            usuarioLogado = data;
            localStorage.setItem('milks_user', JSON.stringify(data));
            atualizarInterfaceLogin();
        } else {
            alert(data.message);
        }
    } catch (err) {
        console.error("Erro no login:", err);
    }
}

function atualizarInterfaceLogin() {
    const adminSection = document.getElementById('area-admin');
    const btnLogin = document.getElementById('btn-login-admin');
    const savedUser = localStorage.getItem('milks_user');

    if (savedUser || usuarioLogado) {
        usuarioLogado = usuarioLogado || JSON.parse(savedUser);
        adminSection.classList.remove('hidden');
        btnLogin.innerText = `Sair (${usuarioLogado.user})`;
        btnLogin.onclick = logout;
    } else {
        adminSection.classList.add('hidden');
        btnLogin.innerText = "🔓 Admin";
        btnLogin.onclick = realizarLogin;
    }
}

function logout() {
    localStorage.removeItem('milks_user');
    usuarioLogado = null;
    location.reload();
}

// --- CRUD DE PRODUTOS ---
async function carregarProdutos(busca = '') {
    const res = await fetch('/api/estoque');
    const produtos = await res.json();
    
    const grid = document.getElementById('grid-produtos');
    const produtosFiltrados = produtos.filter(p => 
        p.item.toLowerCase().includes(busca.toLowerCase())
    );

    grid.innerHTML = produtosFiltrados.map(p => `
        <div class="card" data-testid="product-card-${p.id}" onclick="addCarrinho(${JSON.stringify(p).replace(/"/g, '&quot;')})">
            <div class="img-container">
                <img src="/uploads/${p.imagem_url}" onerror="this.src='/img/default.png'">
            </div>
            <div class="card-info">
                <h4 data-testid="product-name-${p.id}">${p.item}</h4>
                <p class="preco">R$ ${p.preco.toFixed(2)}</p>
                <span class="badge ${p.quantidade <= 0 ? 'empty' : ''}">
                    Estoque: <b data-testid="stock-val-${p.id}">${p.quantidade}</b>
                </span>
            </div>
            ${usuarioLogado ? `<button class="btn-edit" onclick="event.stopPropagation(); prepararEdicao(${JSON.stringify(p).replace(/"/g, '&quot;')})" data-testid="edit-btn-${p.id}">✏️</button>` : ''}
        </div>
    `).join('');
}

async function cadastrarProduto(event) {
    event.preventDefault();
    const id = document.getElementById('edit-id').value;
    const formData = new FormData(event.target); // Captura automática de todos os inputs pelo 'name'

    // Ajuste manual para o checkbox de visibilidade
    const visivel = document.getElementById('visivel-cliente').value;
    formData.append('visivel_cliente', visivel);

    const foto = document.getElementById('input-foto').files[0];
    if (foto) formData.append('foto', foto);

    const url = id ? `/api/estoque/${id}` : '/api/estoque';
    const method = id ? 'PUT' : 'POST';

    const res = await fetch(url, { method, body: formData });
    
    if (res.ok) {
        resetarFormulario();
        carregarProdutos();
        alert("Dados salvos com sucesso!");
    }
}

// --- LÓGICA DO CARRINHO (PDV) ---
function addCarrinho(produto) {
    const item = carrinho.find(c => c.id === produto.id);
    if (item) {
        item.qtd_venda++;
    } else {
        carrinho.push({ ...produto, qtd_venda: 1 });
    }
    renderizarCarrinho();
}

function removerDoCarrinho(index) {
    carrinho.splice(index, 1);
    renderizarCarrinho();
}

function renderizarCarrinho() {
    const lista = document.getElementById('lista-carrinho');
    const totalElement = document.getElementById('valor-total');
    
    if (carrinho.length === 0) {
        lista.innerHTML = '<p class="empty-msg">Carrinho vazio</p>';
        totalElement.innerText = "0.00";
        return;
    }

    let total = 0;
    lista.innerHTML = carrinho.map((item, index) => {
        total += item.preco * item.qtd_venda;
        return `
            <div class="cart-item" data-testid="cart-item-${item.id}">
                <span>${item.item} (x${item.qtd_venda})</span>
                <span>R$ ${(item.preco * item.qtd_venda).toFixed(2)}</span>
                <button onclick="removerDoCarrinho(${index})">❌</button>
            </div>
        `;
    }).join('');

    totalElement.innerText = total.toFixed(2);
}

async function finalizarVenda() {
    if (carrinho.length === 0) return alert("Carrinho vazio!");

    const total = parseFloat(document.getElementById('valor-total').innerText);
    
    const res = await fetch('/api/vendas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            total, 
            itens: carrinho,
            origem: 'pdv'
        })
    });

    if (res.ok) {
        alert("🚀 Venda finalizada e estoque atualizado!");
        carrinho = [];
        renderizarCarrinho();
        carregarProdutos();
    }
}

// --- UTILITÁRIOS ---
function prepararEdicao(p) {
    document.getElementById('edit-id').value = p.id;
    document.getElementById('novo-item').value = p.item;
    document.getElementById('novo-preco').value = p.preco;
    document.getElementById('nova-qtd').value = p.quantidade;
    document.getElementById('nova-cat').value = p.categoria;
    document.getElementById('visivel-cliente').value = p.visivel_cliente;
    
    document.getElementById('btn-salvar').innerText = "Atualizar Produto";
    document.getElementById('btn-cancelar').classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function resetarFormulario() {
    document.getElementById('form-cadastro').reset();
    document.getElementById('edit-id').value = '';
    document.getElementById('btn-salvar').innerText = "Salvar Produto";
    document.getElementById('btn-cancelar').classList.add('hidden');
}