const express = require('express');
const db = require('./database');
const multer = require('multer');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Log de requisições - Ótimo para o console da QA
app.use((req, res, next) => {
    console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
    next();
});

app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Config de Upload do Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, path.join(__dirname, 'uploads/')),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// LOGIN UNIFICADO
app.post('/api/login', (req, res) => {
    const username = req.body.username ? req.body.username.trim().toLowerCase() : '';
    const password = req.body.password ? req.body.password.toString().trim() : '';

    if (username === 'stefany' && password === '123456') {
        return res.json({ id: 99, username: 'stefany', role: 'customer' });
    }
    if (username === 'admin' && password === '123') {
        return res.json({ id: 1, username: 'admin', role: 'admin' });
    }
    res.status(401).json({ message: "Usuário ou senha inválidos" });
});

// LISTAR PRODUTOS (Geral)
app.get('/api/estoque', (req, res) => {
    db.all("SELECT * FROM estoque", [], (err, rows) => res.json(rows));
});

// LISTAR VENDAS
app.get('/api/vendas', (req, res) => {
    db.all("SELECT * FROM vendas ORDER BY id DESC", [], (err, rows) => res.json(rows));
});

// CADASTRAR PRODUTO (POST)
app.post('/api/estoque', upload.single('imagem'), (req, res) => {
    const { item, quantidade, preco, tipo } = req.body;
    const img = req.file ? req.file.filename : 'default.png';

    db.run(
        `INSERT INTO estoque (item, quantidade, preco, imagem_url, visivel_cliente, tipo) VALUES (?,?,?,?,?,?)`,
        [item, parseInt(quantidade) || 0, parseFloat(preco) || 0.0, img, 1, tipo || 'loja'], 
        function(err) {
            if (err) return res.status(500).json({ error: "Erro ao cadastrar produto" });
            res.json({ message: "Criado com sucesso!", id: this.lastID, imagem_url: img });
        }
    );
});

// ATUALIZAR PRODUTO (PUT)
app.put('/api/estoque/:id', upload.single('imagem'), (req, res) => {
    const { item, quantidade, preco, tipo } = req.body;
    const id = req.params.id;
    const img = req.file ? req.file.filename : req.body.imagem_url;

    db.run(
        `UPDATE estoque SET item=?, quantidade=?, preco=?, imagem_url=?, tipo=? WHERE id=?`,
        [item, parseInt(quantidade) || 0, parseFloat(preco) || 0.0, img, tipo || 'loja', id], 
        function(err) {
            if (err) return res.status(500).json({ error: "Erro ao atualizar" });
            res.json({ message: "Atualizado com sucesso!" });
        }
    );
});

// EXCLUIR PRODUTO (DELETE) - Essencial para o fluxo de limpeza (Teardown) do Cypress
app.delete('/api/estoque/:id', (req, res) => {
    db.run("DELETE FROM estoque WHERE id = ?", [req.params.id], function(err) {
        if (err) return res.status(500).json({ error: "Erro ao excluir" });
        res.json({ message: "Excluído com sucesso!" });
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

app.listen(3001, () => console.log("🚀 Servidor da QA rodando na porta 3001"));