import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity, TextInput, Alert, ScrollView } from 'react-native';

const API_URL = 'http://192.168.0.168:3001/api'; 

export default function App() {
  // Estados do App
  const [produtos, setProdutos] = useState([]);
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  // Estados do Fluxo de Compra
  const [telaAtual, setTelaAtual] = useState('login'); // login, vitrine, carrinho, checkout, recibo
  const [carrinho, setCarrinho] = useState([]);
  const [formaPagamento, setFormaPagamento] = useState('');
  const [cep, setCep] = useState('');
  const [destinatario, setDestinatario] = useState('');
  const [dadosRecibo, setDadosRecibo] = useState(null);

  useEffect(() => {
    fetchProdutos();
  }, []);

  const fetchProdutos = async () => {
    try {
      const res = await fetch(`${API_URL}/estoque`);
      const data = await res.json();
      setProdutos(data);
    } catch (err) {
      console.error("Erro ao carregar vitrine:", err);
    }
  };

  const handleLogin = async () => {
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      
      if (res.ok) {
        setUser(data);
        setTelaAtual('vitrine');
      } else {
        Alert.alert("Erro", data.message || "Login inválido");
      }
    } catch (err) {
      Alert.alert("Erro", "Não foi possível conectar ao servidor");
    }
  };

  const handleLogout = () => {
    setUser(null);
    setCarrinho([]);
    setUsername('');
    setPassword('');
    setTelaAtual('login');
  };

  // --- LÓGICA DO CARRINHO ---
  const adicionarAoCarrinho = (produto) => {
    const itemExistente = carrinho.find(item => item.id === produto.id);
    if (itemExistente) {
      setCarrinho(carrinho.map(item => item.id === produto.id ? { ...item, qtd_carrinho: item.qtd_carrinho + 1 } : item));
    } else {
      setCarrinho([...carrinho, { ...produto, qtd_carrinho: 1 }]);
    }
    Alert.alert("Sucesso", `${produto.item} adicionado ao carrinho!`);
  };

  const alterarQuantidade = (id, delta) => {
    setCarrinho(carrinho.map(item => {
      if (item.id === id) {
        const novaQtd = item.qtd_carrinho + delta;
        return novaQtd > 0 ? { ...item, qtd_carrinho: novaQtd } : null;
      }
      return item;
    }).filter(item => item !== null)); // Remove se a quantidade for 0
  };

  const calcularTotal = () => {
    return carrinho.reduce((total, item) => total + (item.preco * item.qtd_carrinho), 0).toFixed(2);
  };

  // --- LÓGICA DE FINALIZAÇÃO (Conectada ao seu server.js) ---
  const finalizarCompra = async () => {
    if (!formaPagamento || !cep || !destinatario) {
      Alert.alert("Atenção", "Preencha todos os dados de entrega e pagamento.");
      return;
    }

    const payloadVenda = {
      total: parseFloat(calcularTotal()),
      origem: 'App Mobile',
      itens: carrinho.map(item => ({ id: item.id, qtd_venda: item.qtd_carrinho }))
    };

    try {
      const res = await fetch(`${API_URL}/vendas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payloadVenda)
      });

      if (res.ok) {
        // Salva os dados para o recibo e limpa o fluxo
        setDadosRecibo({ carrinho: [...carrinho], total: calcularTotal(), destinatario, cep, formaPagamento });
        setCarrinho([]);
        setCep('');
        setDestinatario('');
        setFormaPagamento('');
        setTelaAtual('recibo');
      }
    } catch (err) {
      Alert.alert("Erro", "Falha ao processar a venda.");
    }
  };

  // --- RENDERIZAÇÃO DAS TELAS ---

  if (telaAtual === 'login') {
    return (
      <View style={styles.container}>
        <Text style={styles.title} testID="login-title">Milk's Coffee Login</Text>
        <TextInput style={styles.input} placeholder="Usuário" onChangeText={setUsername} autoCapitalize="none" testID="login-username" />
        <TextInput style={styles.input} placeholder="Senha" secureTextEntry onChangeText={setPassword} testID="login-password" />
        <TouchableOpacity style={styles.button} onPress={handleLogin} testID="login-submit">
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (telaAtual === 'vitrine') {
    const produtosFiltrados = produtos.filter(p => user?.role === 'admin' ? p.visivel_cliente === 0 : p.visivel_cliente === 1);
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title} testID="vitrine-title">Olá, {user?.username}!</Text>
          <View style={{flexDirection: 'row', gap: 10}}>
            {user?.role !== 'admin' && (
              <TouchableOpacity style={styles.cartButton} onPress={() => setTelaAtual('carrinho')} testID="go-to-cart-btn">
                <Text style={styles.buttonText}>🛒 ({carrinho.length})</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} testID="logout-btn">
              <Text style={styles.buttonText}>Sair</Text>
            </TouchableOpacity>
          </View>
        </View>
        <FlatList
          data={produtosFiltrados}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.card} testID={`product-card-${item.id}`}>
              <Image source={{ uri: `${API_URL.replace('/api', '')}/uploads/${item.imagem_url}` }} style={styles.image} />
              <View style={styles.cardContent}>
                <Text style={styles.productName} testID={`product-name-${item.id}`}>{item.item}</Text>
                <Text style={styles.price}>R$ {item.preco.toFixed(2)}</Text>
                <TouchableOpacity style={styles.btnBuy} onPress={() => adicionarAoCarrinho(item)} testID={`buy-btn-${item.id}`}>
                  <Text style={styles.buttonText}>Adicionar</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      </View>
    );
  }

  if (telaAtual === 'carrinho') {
    return (
      <View style={styles.container}>
        <Text style={styles.title} testID="cart-title">Seu Carrinho</Text>
        {carrinho.length === 0 ? (
          <Text testID="empty-cart-text">O carrinho está vazio.</Text>
        ) : (
          <FlatList
            data={carrinho}
            keyExtractor={item => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.cartItem} testID={`cart-item-${item.id}`}>
                <Text style={styles.productName}>{item.item}</Text>
                <Text>R$ {(item.preco * item.qtd_carrinho).toFixed(2)}</Text>
                <View style={styles.qtdContainer}>
                  <TouchableOpacity style={styles.qtdBtn} onPress={() => alterarQuantidade(item.id, -1)} testID={`decrease-btn-${item.id}`}><Text>-</Text></TouchableOpacity>
                  <Text style={styles.qtdText} testID={`qty-text-${item.id}`}>{item.qtd_carrinho}</Text>
                  <TouchableOpacity style={styles.qtdBtn} onPress={() => alterarQuantidade(item.id, 1)} testID={`increase-btn-${item.id}`}><Text>+</Text></TouchableOpacity>
                </View>
              </View>
            )}
          />
        )}
        <Text style={styles.totalText} testID="cart-total">Total: R$ {calcularTotal()}</Text>
        <TouchableOpacity style={styles.button} onPress={() => setTelaAtual('checkout')} disabled={carrinho.length === 0} testID="checkout-btn">
          <Text style={styles.buttonText}>Avançar para Pagamento</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.btnBack]} onPress={() => setTelaAtual('vitrine')} testID="back-to-vitrine-btn">
          <Text style={styles.buttonText}>Voltar à Vitrine</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (telaAtual === 'checkout') {
    return (
      <ScrollView style={styles.container} testID="checkout-screen">
        <Text style={styles.title}>Finalizar Compra</Text>
        
        <Text style={styles.label}>Destinatário:</Text>
        <TextInput style={styles.input} placeholder="Nome de quem vai receber" value={destinatario} onChangeText={setDestinatario} testID="input-nome" />
        
        <Text style={styles.label}>CEP de Entrega:</Text>
        <TextInput style={styles.input} placeholder="00000-000" value={cep} onChangeText={setCep} keyboardType="numeric" testID="input-cep" />
        
        <Text style={styles.label}>Forma de Pagamento:</Text>
        <View style={styles.paymentMethods}>
          {['PIX', 'Cartão de Crédito', 'Cartão de Débito'].map(metodo => (
            <TouchableOpacity 
              key={metodo} 
              style={[styles.payBtn, formaPagamento === metodo && styles.payBtnActive]} 
              onPress={() => setFormaPagamento(metodo)}
              testID={`pay-method-${metodo.replace(/ /g, '')}`}
            >
              <Text style={formaPagamento === metodo ? styles.buttonText : {color: '#000'}}>{metodo}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.totalText}>Valor a Pagar: R$ {calcularTotal()}</Text>
        
        <TouchableOpacity style={styles.button} onPress={finalizarCompra} testID="finish-purchase-btn">
          <Text style={styles.buttonText}>Confirmar Pedido</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.btnBack]} onPress={() => setTelaAtual('carrinho')} testID="back-to-cart-btn">
          <Text style={styles.buttonText}>Voltar ao Carrinho</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  if (telaAtual === 'recibo') {
    return (
      <View style={styles.container} testID="receipt-screen">
        <View style={styles.receiptCard}>
          <Text style={styles.receiptTitle} testID="receipt-title">☕ Nota Fiscal - Milk's</Text>
          <Text>--------------------------------</Text>
          <Text style={styles.receiptText} testID="receipt-name">Cliente: {dadosRecibo.destinatario}</Text>
          <Text style={styles.receiptText} testID="receipt-cep">Entrega: CEP {dadosRecibo.cep}</Text>
          <Text style={styles.receiptText} testID="receipt-pay">Pagamento: {dadosRecibo.formaPagamento}</Text>
          <Text>--------------------------------</Text>
          {dadosRecibo.carrinho.map(item => (
            <Text key={item.id} style={styles.receiptText}>
              {item.qtd_carrinho}x {item.item} - R$ {(item.preco * item.qtd_carrinho).toFixed(2)}
            </Text>
          ))}
          <Text>--------------------------------</Text>
          <Text style={styles.receiptTotal} testID="receipt-total">TOTAL: R$ {dadosRecibo.total}</Text>
        </View>
        <TouchableOpacity style={styles.button} onPress={() => setTelaAtual('vitrine')} testID="new-purchase-btn">
          <Text style={styles.buttonText}>Fazer nova compra</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f1ea', paddingTop: 60, paddingHorizontal: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#4b2c20', textAlign: 'center' },
  label: { fontSize: 16, fontWeight: 'bold', marginBottom: 5, color: '#4b2c20' },
  input: { backgroundColor: 'white', padding: 15, borderRadius: 8, marginBottom: 15, borderWidth: 1, borderColor: '#ddd' },
  button: { backgroundColor: '#4b2c20', padding: 15, borderRadius: 8, alignItems: 'center', marginBottom: 10 },
  btnBack: { backgroundColor: '#8b5a2b' },
  buttonText: { color: 'white', fontWeight: 'bold' },
  cartButton: { backgroundColor: '#2d5a27', padding: 10, borderRadius: 8 },
  card: { backgroundColor: 'white', borderRadius: 12, marginBottom: 15, overflow: 'hidden', elevation: 3 },
  image: { width: '100%', height: 180 },
  cardContent: { padding: 15 },
  productName: { fontSize: 18, fontWeight: 'bold' },
  price: { color: '#2d5a27', fontSize: 16, fontWeight: 'bold', marginVertical: 5 },
  btnBuy: { backgroundColor: '#2d5a27', padding: 10, borderRadius: 6, alignItems: 'center' },
  cartItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'white', padding: 15, borderRadius: 8, marginBottom: 10 },
  qtdContainer: { flexDirection: 'row', alignItems: 'center' },
  qtdBtn: { backgroundColor: '#ddd', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 4 },
  qtdText: { marginHorizontal: 10, fontWeight: 'bold' },
  totalText: { fontSize: 20, fontWeight: 'bold', color: '#4b2c20', marginVertical: 20, textAlign: 'center' },
  paymentMethods: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap' },
  payBtn: { backgroundColor: '#ddd', padding: 10, borderRadius: 8, marginBottom: 10, width: '31%', alignItems: 'center' },
  payBtnActive: { backgroundColor: '#2d5a27' },
  receiptCard: { backgroundColor: 'white', padding: 20, borderRadius: 12, marginBottom: 20, borderWidth: 1, borderColor: '#ddd', borderStyle: 'dashed' },
  receiptTitle: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 },
  receiptText: { fontSize: 16, marginVertical: 2 },
  receiptTotal: { fontSize: 18, fontWeight: 'bold', marginTop: 10, textAlign: 'right' },
  logoutButton: { backgroundColor: '#d9534f', padding: 10, borderRadius: 8 }
});