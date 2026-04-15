import React, { useEffect, useState } from 'react';
import api from '../services/api';
import logoMilks from '../assets/logo-milks.png';

export default function ClienteHome() {
    const [estoque, setEstoque] = useState([]);
    const [carrinho, setCarrinho] = useState(0);

    // Busca os dados reais lá do seu Back-end (server.js)
    const carregarProdutos = async () => {
        try {
            const response = await api.get('/estoque');
            setEstoque(response.data);
        } catch (error) {
            console.error("Erro ao carregar vitrine", error);
        }
    };
    useEffect(() => {
        carregarProdutos();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('userRole');
        window.location.href = '/';
    };
    const finalizarPedido = async () => {
        const confirmacao = window.confirm("Deseja confirmar seu Mocca Especial por R$ 15,50?");

        if (confirmacao) {
            try {
                const response = await api.post('/venda/confirmar', {
                    produto: "Mocca Especial Milk's",
                    preco: 15.50
                });

                alert(response.data.message);
                setCarrinho(0); // Limpa o carrinho após a compra
                carregarProdutos(); // Atualiza a disponibilidade na tela na hora!
            } catch (error) {
                alert("Erro ao processar pedido. Chame um atendente! 🐾");
            }
        }
    };

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#064e3b', color: 'white', padding: '20px', fontFamily: 'sans-serif' }}>

            {/* Header com o Logo Novo */}
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '1px solid #10b981', paddingBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img
                        src={logoMilks}
                        alt="Milk's Coffee Logo"
                        style={{ height: '60px', width: 'auto' }} // Ajuste o tamanho aqui
                    />
                    <div>
                        <p style={{ color: '#10b981', margin: 0, fontSize: '0.9rem' }}>Joinville/SC</p>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    style={{ background: 'none', border: '1px solid #ef4444', color: '#ef4444', padding: '5px 15px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                    Sair
                </button>
            </header>
            {/* Banner Personalizado com seu toque de Coffee */}
            {/* SEÇÃO: LOJA ONLINE (Produtos para entrega) */}
            <section>
                <h2 style={{ borderLeft: '4px solid #10b981', paddingLeft: '10px' }}>Milk's Store 🛍️</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                    {estoque.filter(i => i.categoria === 'loja').map(produto => (
                        <div key={produto.id} style={{ backgroundColor: '#022c22', padding: '15px', borderRadius: '15px' }}>
                            <h4>{produto.item}</h4>
                            <p style={{ fontSize: '0.8rem' }}>{produto.descricao}</p>
                            <p>R$ {produto.preco.toFixed(2)}</p>
                            <button onClick={() => adicionarAoCarrinho(produto)}>Adicionar à Sacola</button>
                        </div>
                    ))}
                </div>
            </section>

            {/* SEÇÃO: CARDÁPIO LOCAL (Apenas informativo) */}
            <section style={{ marginTop: '50px' }}>
                <h2 style={{ borderLeft: '4px solid #f59e0b', paddingLeft: '10px' }}>Para Consumo Local ☕</h2>
                <div style={{ backgroundColor: '#064e3b', borderRadius: '15px', padding: '20px' }}>
                    {estoque.filter(i => i.categoria === 'cardapio').map(item => (
                        <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', borderBottom: '1px solid #065f46' }}>
                            <div>
                                <strong>{item.item}</strong>
                                <p style={{ fontSize: '0.75rem', color: '#a7f3d0' }}>{item.descricao}</p>
                            </div>
                            <span>R$ {item.preco.toFixed(2)}</span>
                        </div>
                    ))}
                    <p style={{ textAlign: 'center', marginTop: '20px', color: '#f59e0b', fontWeight: 'bold' }}>
                        ⚠️ Os pedidos abaixo devem ser realizados diretamente no balcão.
                    </p>
                </div>
            </section>

            {/* Carrinho Flutuante */}
            {carrinho > 0 && (
                <div style={{ position: 'fixed', bottom: '30px', left: '50%', transform: 'translateX(-50%)', backgroundColor: '#10b981', padding: '15px 35px', borderRadius: '50px', boxShadow: '0 10px 30px rgba(0,0,0,0.4)', fontWeight: 'bold' }}>
                    🛒 {carrinho} {carrinho === 1 ? 'item selecionado' : 'itens selecionados'}
                </div>
            )}
        </div>
    );
}