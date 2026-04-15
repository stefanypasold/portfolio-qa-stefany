import React, { useEffect, useState } from 'react';
import api from '../services/api';

export default function PDV() {
    const [estoque, setEstoque] = useState([]);
    const [vendas, setVendas] = useState([]); // Novo estado para o histórico
    const [mensagem, setMensagem] = useState('');

    const carregarDados = async () => {
        try {
            const [resEstoque, resVendas] = await Promise.all([
                api.get('/estoque'),
                api.get('/vendas')
            ]);
            setEstoque(resEstoque.data);
            setVendas(resVendas.data);
        } catch (error) {
            console.error("Erro ao buscar dados", error);
        }
    };

    const venderMocca = async () => {
        try {
            const response = await api.post('/venda/mocca');
            setMensagem(response.data.message);
            carregarDados(); // Recarrega estoque E vendas
        } catch (error) {
            setMensagem(error.response?.data?.error || "Erro na venda");
        }
    };

    const reporEstoque = async (itemNome) => {
        try {
            await api.post('/estoque/repor', { item: itemNome, quantidade: 100 });
            setMensagem(`Reposição de ${itemNome} realizada!`);
            carregarDados(); 
        } catch (error) {
            console.error("Erro ao repor estoque", error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('userRole');
        window.location.href = '/'; 
    };

    useEffect(() => {
        carregarDados();
    }, []);

    return (
        <div style={{ padding: '20px', color: 'white', maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1>PDV Milk's Café 🐶☕</h1>
                <button onClick={handleLogout} style={{ padding: '8px 15px', backgroundColor: '#ef4444', borderRadius: '8px', border: 'none', color: 'white', cursor: 'pointer', fontWeight: 'bold' }}>
                    Sair do Sistema
                </button>
            </div>

            {/* SEÇÃO DE ESTOQUE */}
            <section style={{ backgroundColor: '#022c22', padding: '15px', borderRadius: '12px', marginBottom: '20px' }}>
                <h2 style={{ color: '#10b981' }}>Estoque Atual</h2>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {Array.isArray(estoque) && estoque.map(item => (
                        <li key={item.id} style={{ padding: '5px 0', borderBottom: '1px solid #064e3b' }}>
                            <strong>{item.item}:</strong> {item.quantidade} {item.unidade}
                        </li>
                    ))}
                </ul>
                <button onClick={venderMocca} style={{ width: '100%', padding: '12px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', marginTop: '15px' }}>
                    Vender 1 Mocca (R$ 15,50)
                </button>
            </section>

            {/* PAINEL DE REPOSIÇÃO */}
            <section style={{ marginBottom: '20px' }}>
                <p>Reposição Rápida:</p>
                <button onClick={() => reporEstoque('Leite')} style={{ marginRight: '10px', padding: '8px', cursor: 'pointer' }}>+ 100ml Leite</button>
                <button onClick={() => reporEstoque('Café em Grãos')} style={{ padding: '8px', cursor: 'pointer' }}>+ 100g Café</button>
            </section>

            {/* HISTÓRICO DE VENDAS */}
            <section style={{ backgroundColor: '#022c22', padding: '15px', borderRadius: '12px' }}>
                <h2 style={{ color: '#10b981' }}>Histórico de Vendas</h2>
                <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                    <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '2px solid #059669' }}>
                                <th style={{ padding: '8px' }}>Produto</th>
                                <th style={{ padding: '8px' }}>Valor</th>
                                <th style={{ padding: '8px' }}>Data</th>
                            </tr>
                        </thead>
                        <tbody>
                            {vendas.map(venda => (
                                <tr key={venda.id} style={{ borderBottom: '1px solid #064e3b' }}>
                                    <td style={{ padding: '8px' }}>{venda.produto}</td>
                                    <td style={{ padding: '8px' }}>R$ {venda.valor.toFixed(2)}</td>
                                    <td style={{ padding: '8px', fontSize: '11px' }}>{new Date(venda.data).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            {mensagem && (
                <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#064e3b', border: '1px solid yellow', borderRadius: '8px', color: 'yellow', textAlign: 'center' }}>
                    {mensagem}
                </div>
            )}
        </div>
    );
}