const express = require('express');
const db = require('./database');
const multer = require('multer');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Middleware para LOG de monitoramento (ajuda muito no debug do mobile)
app.use((req, res, next) => {
    console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
    next();
});

app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Config de Upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, path.join(__dirname, 'uploads/')),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// LOGIN UNIFICADO
app.post('/api/login', (req, res) => {
    const username = req.body.username ? req.body.username.trim().toLowerCase() : '';
    const password = req.body.password ? req.body.password.toString().trim() : '';

    console.log(`Tentativa de login: [${username}] com senha: [${password}]`);

    if (username === 'stefany' && password === '123456') {
        console.log("Login de Stefany aprovado!");
        return res.json({ id: 99, username: 'stefany', role: 'customer' });
    }

    if (username === 'admin' && password === '123') {
        console.log("Login de Admin aprovado!");
        return res.json({ id: 1, username: 'admin', role: 'admin' });
    }

    res.status(401).json({ message: "Usuário ou senha inválidos" });
});

// ROTA PARA O APP MOBILE (Vitrine)
// Adicionada para resolver o erro 404 que o app estava dando
app.get('/api/products', (req, res) => {
    // Retorna apenas itens que tenham quantidade > 0 (opcional, mas recomendado)
    db.all("SELECT * FROM estoque WHERE visivel_cliente = 1", [], (err, rows) => {
        if (err) {
            console.error("Erro ao buscar produtos:", err);
            return res.status(500).json({ error: "Erro interno no banco" });
        }
        res.json(rows);
    });
});

// CRUD ESTOQUE (Usado pelo Painel Web)
app.get('/api/estoque', (req, res) => {
    db.all("SELECT * FROM estoque", [], (err, rows) => res.json(rows));
});

app.post('/api/estoque', upload.single('foto'), (req, res) => {
    const { item, quantidade, preco, categoria, descricao, visivel_cliente } = req.body;
    const img = req.file ? req.file.filename : 'default.png';
    db.run(`INSERT INTO estoque (item, quantidade, preco, categoria, descricao, imagem_url, visivel_cliente) VALUES (?,?,?,?,?,?,?)`,
        [item, quantidade, preco, categoria, descricao, img, visivel_cliente], function() {
            res.json({ message: "Criado!", id: this.lastID });
        });
});

app.put('/api/estoque/:id', upload.single('foto'), (req, res) => {
    const { item, quantidade, preco, categoria, descricao, visivel_cliente } = req.body;
    const id = req.params.id;
    const img = req.file ? req.file.filename : req.body.imagem_url;

    db.run(`UPDATE estoque SET item=?, quantidade=?, preco=?, categoria=?, descricao=?, visivel_cliente=?, imagem_url=? WHERE id=?`,
        [item, quantidade, preco, categoria, descricao, visivel_cliente, img, id], () => {
            res.json({ message: "Atualizado!" });
        });
});

// FINALIZAR VENDA
app.post('/api/vendas', (req, res) => {
    const { total, itens, origem } = req.body;
    db.serialize(() => {
        db.run("INSERT INTO vendas (itens, total, origem) VALUES (?, ?, ?)", [JSON.stringify(itens), total, origem]);
        itens.forEach(i => {
            db.run("UPDATE estoque SET quantidade = quantidade - ? WHERE id = ?", [i.qtd_venda, i.id]);
        });
        res.json({ message: "Venda concluída!" });
    });
});

app.listen(3001, () => console.log("🚀 Servidor Full-Stack Milk's Coffee na porta 3001"));