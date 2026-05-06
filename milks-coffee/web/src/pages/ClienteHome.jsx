import React, { useEffect, useState } from 'react';
import api from '../services/api';

export default function ClienteHome() {
    const [estoque, setEstoque] = useState([]);
    const [carrinho, setCarrinho] = useState([]);
    const [cep, setCep] = useState('');
    const [metodoPagamento, setMetodoPagamento] = useState('pix');
    const [mensagem, setMensagem] = useState('');

    const carregarProdutos = async () => {
        try {
            const response = await api.get('/estoque');
            setEstoque(response.data);
        } catch (error) {
            console.error("Erro ao carregar vitrine", error);
        }
    };

    const adicionarAoCarrinho = (produto) => {
        const itemExiste = carrinho.find(item => item.id === produto.id);
        if (itemExiste) setCarrinho(carrinho.map(item => item.id === produto.id ? { ...itemExiste, qtd: itemExiste.qtd + 1 } : item));
        else setCarrinho([...carrinho, { ...produto, qtd: 1 }]);
    };

    const removerDoCarrinho = (id) => setCarrinho(carrinho.filter(item => item.id !== id));

    const finalizarCompra = async () => {
        if (carrinho.length === 0) return setMensagem("❌ Carrinho vazio.");
        if (!cep) return setMensagem("❌ Preencha o CEP de entrega.");

        try {
            const total = carrinho.reduce((acc, item) => acc + (item.preco * item.qtd), 0);
            const itensFormatados = carrinho.map(i => ({ id: i.id, item: i.item, qtd_venda: i.qtd, preco: i.preco }));
            
            await api.post('/vendas', { 
                total, 
                itens: itensFormatados, 
                origem: `App Cliente | Pgto: ${metodoPagamento} | CEP: ${cep}` 
            });

            setMensagem("🎉 Pedido confirmado com sucesso!");
            setCarrinho([]); setCep('');
        } catch (error) {
            setMensagem("Erro ao processar checkout.");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('userRole');
        window.location.href = '/';
    };

    useEffect(() => { carregarProdutos(); }, []);

    return (
        <div style={{ padding: '20px', color: 'white', maxWidth: '1200px', margin: '0 auto' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '2px solid #10b981', paddingBottom: '10px' }}>
                <h1 data-cy="titulo-loja-cliente">Milk's Store 🛍️</h1>
                <button data-cy="btn-logout-cliente" onClick={handleLogout} style={{ padding: '8px 15px', backgroundColor: 'transparent', border: '1px solid #10b981', color: '#10b981', borderRadius: '8px', cursor: 'pointer' }}>Sair</button>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px' }}>
                
                {/* VITRINE */}
                <div>
                    <h2 style={{ color: '#10b981' }}>Nossos Produtos</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '20px' }}>
                        {estoque.filter(item => item.tipo === 'loja').map(item => (
                            <div key={item.id} data-cy={`vitrine-produto-${item.item.replace(/\s+/g, '-').toLowerCase()}`} style={{ border: '1px solid #064e3b', padding: '15px', borderRadius: '12px', textAlign: 'center', backgroundColor: '#022c22' }}>
                                {item.imagem_url && <img src={`http://localhost:3001/uploads/${item.imagem_url}`} alt={item.item} style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '8px', marginBottom: '10px' }} />}
                                <strong data-cy="vitrine-nome-produto" style={{ display: 'block', fontSize: '18px' }}>{item.item}</strong>
                                <span data-cy="vitrine-preco-produto" style={{ color: '#10b981', display: 'block', margin: '10px 0', fontSize: '16px', fontWeight: 'bold' }}>R$ {parseFloat(item.preco).toFixed(2)}</span>
                                <button data-cy="btn-add-carrinho" onClick={() => adicionarAoCarrinho(item)} style={{ width: '100%', padding: '10px', backgroundColor: '#059669', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                                    Adicionar à Sacola
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* CHECKOUT DO CLIENTE */}
                <aside style={{ backgroundColor: '#022c22', padding: '20px', borderRadius: '12px', height: 'fit-content', border: '1px solid #059669' }}>
                    <h2 style={{ color: '#10b981', marginTop: 0, borderBottom: '1px solid #064e3b', paddingBottom: '10px' }}>🛒 Sua Sacola</h2>
                    
                    {carrinho.length === 0 ? <p data-cy="msg-carrinho-vazio" style={{ color: '#64748b' }}>Sua sacola está vazia.</p> : (
                        <>
                            <ul data-cy="lista-carrinho" style={{ listStyle: 'none', padding: 0, marginBottom: '20px' }}>
                                {carrinho.map(item => (
                                    <li key={item.id} data-cy={`item-carrinho-${item.item.replace(/\s+/g, '-').toLowerCase()}`} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                                        <div>
                                            <strong style={{ display: 'block' }}>{item.item}</strong>
                                            <span style={{ fontSize: '12px', color: '#94a3b8' }}>{item.qtd}x R$ {parseFloat(item.preco).toFixed(2)}</span>
                                        </div>
                                        <button data-cy="btn-remover-item" onClick={() => removerDoCarrinho(item.id)} style={{ backgroundColor: 'transparent', color: '#ef4444', border: 'none', cursor: 'pointer', fontSize: '18px' }}>🗑️</button>
                                    </li>
                                ))}
                            </ul>

                            {/* DADOS DE ENTREGA E PAGAMENTO */}
                            <div style={{ borderTop: '1px solid #064e3b', paddingTop: '15px', marginBottom: '20px' }}>
                                <label style={{ display: 'block', fontSize: '12px', marginBottom: '5px' }}>CEP de Entrega:</label>
                                <input data-cy="input-cep" type="text" value={cep} onChange={e => setCep(e.target.value)} placeholder="Ex: 89200-000" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #064e3b', backgroundColor: '#011c15', color: 'white', marginBottom: '15px' }} />

                                <label style={{ display: 'block', fontSize: '12px', marginBottom: '5px' }}>Forma de Pagamento:</label>
                                <select data-cy="select-pagamento" value={metodoPagamento} onChange={e => setMetodoPagamento(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #064e3b', backgroundColor: '#011c15', color: 'white' }}>
                                    <option value="pix">PIX</option>
                                    <option value="credito">Cartão de Crédito</option>
                                    <option value="debito">Cartão de Débito</option>
                                </select>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: 'bold', marginBottom: '20px' }}>
                                <span>Total:</span>
                                <span data-cy="valor-total-carrinho">R$ {carrinho.reduce((acc, item) => acc + (item.preco * item.qtd), 0).toFixed(2)}</span>
                            </div>

                            <button data-cy="btn-finalizar-compra" onClick={finalizarCompra} style={{ width: '100%', padding: '15px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }}>
                                Confirmar Pagamento
                            </button>
                        </>
                    )}
                </aside>
            </div>

            {mensagem && (
                <div data-cy="toast-mensagem-cliente" style={{ position: 'fixed', bottom: '20px', left: '50%', transform: 'translateX(-50%)', padding: '15px 30px', backgroundColor: '#10b981', borderRadius: '30px', color: 'white', fontWeight: 'bold' }}>
                    {mensagem}
                </div>
            )}
        </div>
    );
}