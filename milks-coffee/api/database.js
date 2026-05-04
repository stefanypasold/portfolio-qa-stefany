const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(path.join(__dirname, 'milks_database.db'), (err) => {
    if (err) console.error("Erro ao conectar no banco", err.message);
    else console.log("Conectado ao banco de dados SQLite.");
});

db.serialize(() => {
    // 1. Tabela de Produtos (Estoque) - Já inclui a coluna 'tipo' por padrão para novos bancos
    db.run(`
        CREATE TABLE IF NOT EXISTS estoque (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            item TEXT NOT NULL,
            quantidade INTEGER NOT NULL,
            preco REAL NOT NULL,
            categoria TEXT,
            descricao TEXT,
            imagem_url TEXT,
            visivel_cliente INTEGER DEFAULT 1,
            tipo TEXT DEFAULT 'loja'
        )
    `);

    // 2. COMANDO DE SEGURANÇA: Garante que a coluna 'tipo' seja criada caso a tabela já exista sem ela
    db.all("PRAGMA table_info(estoque)", (err, columns) => {
        if (err) {
            console.error("Erro ao verificar colunas da tabela estoque:", err);
            return;
        }
        const colunaTipoExiste = columns.some(col => col.name === 'tipo');
        if (!colunaTipoExiste) {
            db.run("ALTER TABLE estoque ADD COLUMN tipo TEXT DEFAULT 'loja'", (alterErr) => {
                if (alterErr) console.error("Erro ao adicionar coluna 'tipo':", alterErr);
                else console.log("⚠️ Coluna 'tipo' adicionada com sucesso à tabela existente!");
            });
        }
    });

    // Tabela de Usuários 
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT,
        role TEXT -- 'admin' ou 'customer'
    )`);

    // Inserir usuários iniciais se eles não existirem
    const stmt = db.prepare("INSERT OR IGNORE INTO users (username, password, role) VALUES (?, ?, ?)");
    stmt.run('stefany', '123456', 'customer');
    stmt.run('admin', '123', 'admin');
    stmt.finalize();

    // Tabela de Vendas
    db.run(`CREATE TABLE IF NOT EXISTS vendas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        itens TEXT,
        total REAL,
        origem TEXT,
        data_hora DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Inserir produtos de teste e configurar o tipo (Loja vs Cardápio)
    db.get("SELECT COUNT(*) as count FROM estoque", (err, row) => {
        if (row && row.count === 0) {
            const stmtEstoque = db.prepare(`
                INSERT INTO estoque (item, quantidade, preco, categoria, descricao, imagem_url, visivel_cliente, tipo) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `);
            
            // ---> ITENS DE CLIENTE (Store / Loja) - visivel_cliente = 1, tipo = 'loja'
            stmtEstoque.run('Moletom Milk\'s', 20, 120.00, 'Vestuário', 'Moletom super confortável', 'moletom.png', 1, 'loja');
            stmtEstoque.run('Coador de Vidro', 15, 65.00, 'Acessórios', 'Coador de vidro reutilizável', 'coador.png', 1, 'loja');
            stmtEstoque.run('Caneca Milk\'s', 30, 45.00, 'Acessórios', 'Caneca de cerâmica', 'caneca-v.png', 1, 'loja');
            stmtEstoque.run('Café Especial 250g', 50, 35.00, 'Cafés', 'Grãos selecionados torra média', 'cafe-premium.png', 1, 'loja');

            // ---> ITENS DE ADMIN (Balcão / Cardápio) - visivel_cliente = 0, tipo = 'cardapio'
            stmtEstoque.run('Café Expresso', 100, 8.50, 'Bebidas', 'Café puro e forte', 'espresso.png', 0, 'cardapio');
            stmtEstoque.run('Cappuccino', 50, 12.00, 'Bebidas', 'Café, leite e espuma', 'cappuccino.png', 0, 'cardapio');
            stmtEstoque.run('Bolo de Cenoura', 20, 15.00, 'Comidas', 'Com cobertura de chocolate', 'bolo-cenoura.png', 0, 'cardapio');
            
            stmtEstoque.finalize();
            console.log("☕ Produtos de teste ajustados: Loja vs Cardápio!");
        }
    });

    console.log("✅ Banco de dados Milk's Coffee pronto e populado!");
});

module.exports = db;