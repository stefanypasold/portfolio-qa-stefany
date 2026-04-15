import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const navigate = useNavigate();
    const [userType, setUserType] = useState('cliente');

    // ESTA É A FUNÇÃO QUE BATE O CARIMBO NO STORAGE
    const handleLogin = () => {
        console.log("Tentando logar como:", userType); // Log para você ver no F12
        
        // Salva na memória do navegador
        localStorage.setItem('userRole', userType); 
        
        // Redireciona conforme o tipo
        if (userType === 'pdv') {
            navigate('/pdv');
        } else {
            navigate('/loja');
        }
    };

    return (
        <div className="min-h-screen bg-milks-green flex items-center justify-center text-milks-white p-4">
            <div className="max-w-md w-full bg-[#022c22] p-8 rounded-3xl shadow-2xl border border-emerald-900">

                <div className="flex justify-center mb-6">
                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center border-4 border-emerald-400">
                        <span className="text-milks-green font-black text-center leading-tight">MILK'S<br />🐶</span>
                    </div>
                </div>

                <h2 className="text-2xl font-bold text-center mb-8">Bem-vindo ao Milk's Café</h2>

                {/* Seletor de Tipo de Usuário */}
                <div className="flex bg-[#064e3b] p-1 rounded-xl mb-6">
                    <button
                        type="button"
                        onClick={() => setUserType('cliente')}
                        className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${userType === 'cliente' ? 'bg-emerald-500 text-white shadow' : 'text-emerald-300'}`}
                    >
                        Sou Cliente
                    </button>
                    <button
                        type="button"
                        onClick={() => setUserType('pdv')}
                        className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${userType === 'pdv' ? 'bg-emerald-500 text-white shadow' : 'text-emerald-300'}`}
                    >
                        Sou Atendente (PDV)
                    </button>
                </div>

                <form className="space-y-4">
                    <input
                        type="email"
                        placeholder="E-mail"
                        className="w-full p-4 rounded-xl bg-[#064e3b] border border-emerald-800 focus:ring-2 focus:ring-emerald-400 outline-none text-white"
                    />
                    <input
                        type="password"
                        placeholder="Senha"
                        className="w-full p-4 rounded-xl bg-[#064e3b] border border-emerald-800 focus:ring-2 focus:ring-emerald-400 outline-none text-white"
                    />
                    
                    {/* BOTÃO QUE CHAMA A FUNÇÃO HANDLELOGIN */}
                    <button
                        type="button"
                        onClick={handleLogin}
                        className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 rounded-xl font-black uppercase tracking-wider transition-all text-white"
                    >
                        Entrar no Sistema
                    </button>
                </form>

                <p className="text-center mt-6 text-emerald-400 text-sm">
                    {userType === 'cliente' ? 'Esqueceu a senha?' : 'Acesso restrito a funcionários licenciados'}
                </p>
            </div>
        </div>
    );
}