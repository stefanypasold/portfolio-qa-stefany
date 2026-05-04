import React, { useEffect, useState } from 'react';
import api from '../services/api';

export default function PDV() {
    const [estoque, setEstoque] = useState([]);
    const [carrinho, setCarrinho] = useState([]);
    const [mensagem, setMensagem] = useState('');

    const [editandoId, setEditandoId] = useState(null);
    const [novoItem, setNovoItem] = useState('');
    const [novaQuantidade, setNovaQuantidade] = useState('');
    const [novoPreco, setNovoPreco] = useState('');
    const [tipoProduto, setTipoProduto] = useState('loja'); 
    const [foto, setFoto] = useState(null); 

    const carregarDados = async () => {
        try {
            const resEstoque = await api.get('/estoque');
            setEstoque(resEstoque.data);
        } catch (error) {
            console.error("Erro ao buscar dados", error);
        }
    };

    const handleFileChange = (e) => setFoto(e.target.files[0]);

    const prepararEdicao = (produto) => {
        setEditandoId(produto.id);
        setNovoItem(produto.item);
        setNovaQuantidade(produto.quantidade);
        setNovoPreco(produto.preco);
        setTipoProduto(produto.tipo);
        window.scrollTo({ top: 0, behavior: 'smooth' }); 
    };

    const excluirItem = async (id) => {
        if (window.confirm("Atenção QA: Confirma a exclusão deste dado de teste?")) {
            try {
                await api.delete(`/estoque/${id}`);
                setMensagem("🗑️ Produto excluído com sucesso!");
                carregarDados();
            } catch (error) {
                console.error("Erro ao excluir", error);
            }
        }
    };

    const salvarItem = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('item', novoItem);
            formData.append('quantidade', parseInt(novaQuantidade));
            formData.append('preco', parseFloat(novoPreco));
            formData.append('tipo', tipoProduto.toLowerCase());
            if (foto) formData.append('imagem', foto); 

            if (editandoId) {
                await api.put(`/estoque/${editandoId}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
                setMensagem(`✅ Produto atualizado!`);
            } else {
                await api.post('/estoque', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
                setMensagem(`✅ Produto criado com sucesso!`);
            }

            setEditandoId(null); setNovoItem(''); setNovaQuantidade(''); setNovoPreco(''); setFoto(null);
            document.getElementById('input-foto').value = '';
            carregarDados(); 
        } catch (error) {
            setMensagem("❌ Erro na operação.");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('userRole');
        window.location.href = '/'; 
    };

    useEffect(() => { carregarDados(); }, []);

    return (
        <div style={{ padding: '20px', color: 'white', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h1 data-cy="titulo-painel-admin">PDV Milk's Café 🐶☕</h1>
                <button data-cy="btn-logout" onClick={handleLogout} style={{ padding: '8px 15px', backgroundColor: '#ef4444', borderRadius: '8px', border: 'none', color: 'white', cursor: 'pointer', fontWeight: 'bold' }}>Sair</button>
            </div>

            {/* FORMULÁRIO */}
            <section style={{ backgroundColor: '#022c22', padding: '20px', borderRadius: '12px', marginBottom: '30px', border: `2px solid ${editandoId ? '#f59e0b' : '#10b981'}` }}>
                <h2 style={{ color: editandoId ? '#f59e0b' : '#10b981', marginTop: 0, marginBottom: '20px' }}>
                    {editandoId ? '✏️ Editando Produto' : '➕ Novo Produto'}
                </h2>
                
                <form onSubmit={salvarItem} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    
                    {/* LINHA 1 */}
                    <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                        <div style={{ flex: 2, minWidth: '200px' }}>
                            <label style={{ display: 'block', fontSize: '13px', marginBottom: '5px', fontWeight: 'bold' }}>Nome do Item:</label>
                            <input data-cy="input-nome" type="text" value={novoItem} onChange={(e) => setNovoItem(e.target.value)} required placeholder="Ex: Café Especial" style={{ width: '100%', padding: '10px', borderRadius: '6px', backgroundColor: '#011c15', color: 'white', border: '1px solid #10b981' }} />
                        </div>
                        <div style={{ flex: 1, minWidth: '120px' }}>
                            <label style={{ display: 'block', fontSize: '13px', marginBottom: '5px', fontWeight: 'bold' }}>Preço (R$):</label>
                            <input data-cy="input-preco" type="number" step="0.01" value={novoPreco} onChange={(e) => setNovoPreco(e.target.value)} required placeholder="0.00" style={{ width: '100%', padding: '10px', borderRadius: '6px', backgroundColor: '#011c15', color: 'white', border: '1px solid #10b981' }} />
                        </div>
                        <div style={{ flex: 1, minWidth: '80px' }}>
                            <label style={{ display: 'block', fontSize: '13px', marginBottom: '5px', fontWeight: 'bold' }}>Qtd:</label>
                            <input data-cy="input-qtd" type="number" value={novaQuantidade} onChange={(e) => setNovaQuantidade(e.target.value)} required placeholder="0" style={{ width: '100%', padding: '10px', borderRadius: '6px', backgroundColor: '#011c15', color: 'white', border: '1px solid #10b981' }} />
                        </div>
                    </div>

                    {/* LINHA 2 */}
                    <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
                        <div style={{ flex: 1, minWidth: '150px' }}>
                            <label style={{ display: 'block', fontSize: '13px', marginBottom: '5px', fontWeight: 'bold' }}>Categoria:</label>
                            <select data-cy="select-tipo" value={tipoProduto} onChange={(e) => setTipoProduto(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', backgroundColor: '#011c15', color: 'white', border: '1px solid #10b981' }}>
                                <option value="loja">Loja</option>
                                <option value="cardapio">Cardápio</option>
                            </select>
                        </div>
                        <div style={{ flex: 2, minWidth: '200px' }}>
                            <label style={{ display: 'block', fontSize: '13px', marginBottom: '5px', fontWeight: 'bold' }}>Foto do Produto:</label>
                            <input data-cy="input-foto" id="input-foto" type="file" onChange={handleFileChange} style={{ width: '100%', padding: '7px', color: 'white', backgroundColor: '#011c15', border: '1px solid #10b981', borderRadius: '6px' }} />
                        </div>
                        <div style={{ display: 'flex', gap: '10px', minWidth: '200px' }}>
                            {editandoId && (
                                <button type="button" onClick={() => { setEditandoId(null); setNovoItem(''); setNovoPreco(''); setNovaQuantidade(''); }} style={{ flex: 1, padding: '10px', backgroundColor: '#64748b', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                                    Cancelar
                                </button>
                            )}
                            <button data-cy="btn-salvar" type="submit" style={{ flex: 1, padding: '10px', backgroundColor: editandoId ? '#f59e0b' : '#10b981', color: editandoId ? 'black' : 'white', borderRadius: '8px', cursor: 'pointer', border: 'none', fontWeight: 'bold', minWidth: '120px' }}>
                                {editandoId ? 'Salvar Edição' : 'Cadastrar'}
                            </button>
                        </div>
                    </div>

                </form>
            </section>

            {/* LISTAGEM ADMIN */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <section style={{ backgroundColor: '#022c22', padding: '15px', borderRadius: '12px' }}>
                    <h2 style={{ color: '#10b981' }}>🛍️ Itens da Loja</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {estoque.filter(item => item.tipo === 'loja').map(item => (
                            <div key={item.id} data-cy={`produto-${item.item.replace(/\s+/g, '-').toLowerCase()}`} style={{ border: '1px solid #064e3b', padding: '15px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#011c15' }}>
                                <span><strong>{item.item}</strong><br/><span style={{ fontSize: '13px', color: '#10b981'}}>R$ {item.preco.toFixed(2)} | Qtd: {item.quantidade}</span></span>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <button data-cy="btn-editar" onClick={() => prepararEdicao(item)} style={{ background: '#f59e0b', color: 'black', border: 'none', borderRadius: '6px', cursor: 'pointer', padding: '6px 12px', fontWeight: 'bold', fontSize: '13px' }}>✎ Editar</button>
                                    <button data-cy="btn-excluir" onClick={() => excluirItem(item.id)} style={{ background: '#ef4444', color: 'black', border: 'none', borderRadius: '6px', cursor: 'pointer', padding: '6px 12px', fontWeight: 'bold', fontSize: '13px' }}>✖ Excluir</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section style={{ backgroundColor: '#022c22', padding: '15px', borderRadius: '12px' }}>
                    <h2 style={{ color: '#38bdf8' }}>📋 Cardápio do Balcão</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {estoque.filter(item => item.tipo === 'cardapio').map(item => (
                            <div key={item.id} data-cy={`produto-${item.item.replace(/\s+/g, '-').toLowerCase()}`} style={{ border: '1px solid #083344', padding: '15px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#011c15' }}>
                                <span><strong>{item.item}</strong><br/><span style={{ fontSize: '13px', color: '#38bdf8'}}>R$ {item.preco.toFixed(2)} | Qtd: {item.quantidade}</span></span>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <button data-cy="btn-editar" onClick={() => prepararEdicao(item)} style={{ background: '#f59e0b', color: 'black', border: 'none', borderRadius: '6px', cursor: 'pointer', padding: '6px 12px', fontWeight: 'bold', fontSize: '13px' }}>✎ Editar</button>
                                    <button data-cy="btn-excluir" onClick={() => excluirItem(item.id)} style={{ background: '#ef4444', color: 'black', border: 'none', borderRadius: '6px', cursor: 'pointer', padding: '6px 12px', fontWeight: 'bold', fontSize: '13px' }}>✖ Excluir</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            {mensagem && (
                <div data-cy="toast-mensagem" style={{ position: 'fixed', bottom: '20px', right: '20px', padding: '15px', backgroundColor: '#10b981', borderRadius: '8px', color: 'white', fontWeight: 'bold', boxShadow: '0 4px 6px rgba(0,0,0,0.3)' }}>
                    {mensagem}
                </div>
            )}
        </div>
    );
}