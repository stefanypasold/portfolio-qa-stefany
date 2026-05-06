import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function Login() {
    const navigate = useNavigate();
    
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [erro, setErro] = useState(''); 
    const [userType, setUserType] = useState('cliente'); 

    const handleLogin = async (e) => {
        e.preventDefault(); 
        setErro(''); 

        try {
            const response = await api.post('/login', { 
                username: username, 
                password: password 
            });

            const dadosUsuario = response.data;
            console.log("Login aprovado pela API!", dadosUsuario);

            // A CORREÇÃO ESTÁ AQUI: 
            // Traduzimos a resposta da API para a permissão que as suas rotas já esperam
            if (dadosUsuario.role === 'admin') {
                localStorage.setItem('userRole', 'pdv'); 
                navigate('/pdv');
            } else {
                localStorage.setItem('userRole', 'cliente'); 
                navigate('/loja');
            }

        } catch (error) {
            console.error("Falha no login", error);
            setErro('Usuário ou senha inválidos. Tente novamente!');
        }
    };

    return (
        <div className="min-h-screen bg-[#064e3b] flex items-center justify-center text-white p-4">
            <div className="max-w-md w-full bg-[#022c22] p-8 rounded-3xl shadow-2xl border border-emerald-900">

                <div className="flex justify-center mb-6">
                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center border-4 border-emerald-400">
                        <span className="text-[#064e3b] font-black text-center leading-tight">MILK'S<br />🐶</span>
                    </div>
                </div>

                <h2 className="text-2xl font-bold text-center mb-8 text-white">Bem-vindo ao Milk's Café</h2>

                <div className="flex bg-[#064e3b] p-1 rounded-xl mb-6">
                    <button
                        data-cy="aba-cliente"
                        type="button"
                        onClick={() => setUserType('cliente')}
                        className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${userType === 'cliente' ? 'bg-emerald-500 text-white shadow' : 'text-emerald-300'}`}
                    >
                        Sou Cliente
                    </button>
                    <button
                        data-cy="aba-pdv"
                        type="button"
                        onClick={() => setUserType('pdv')}
                        className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${userType === 'pdv' ? 'bg-emerald-500 text-white shadow' : 'text-emerald-300'}`}
                    >
                        Sou Atendente (PDV)
                    </button>
                </div>

                {erro && (
                    <div data-cy="msg-erro-login" className="mb-4 p-3 bg-red-500 text-white text-sm font-bold text-center rounded-lg">
                        {erro}
                    </div>
                )}

                <form className="space-y-4" onSubmit={handleLogin}>
                    <input
                        data-cy="input-username"
                        type="text" 
                        placeholder="Usuário"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full p-4 rounded-xl bg-[#064e3b] border border-emerald-800 focus:ring-2 focus:ring-emerald-400 outline-none text-white"
                        required
                    />
                    <input
                        data-cy="input-password"
                        type="password"
                        placeholder="Senha"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-4 rounded-xl bg-[#064e3b] border border-emerald-800 focus:ring-2 focus:ring-emerald-400 outline-none text-white"
                        required
                    />
                    
                    <button
                        data-cy="btn-entrar"
                        type="submit" 
                        className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 rounded-xl font-black uppercase tracking-wider transition-all text-white"
                    >
                        Entrar
                    </button>
                </form>

            </div>
        </div>
    );
}