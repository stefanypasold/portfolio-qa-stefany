# language: pt
Funcionalidade: Login no Painel Administrativo
  Como um administrador da Milk's Coffee
  Quero fazer login no sistema
  Para gerenciar os pedidos e produtos

  Cenário: Login com credenciais válidas (Caminho Feliz)
    Dado que eu acesso a página de login do painel
    Quando eu preencho o campo usuário com "admin" e a senha com "admin123"
    E clico no botão de entrar
    Então eu devo ser redirecionado para o dashboard principal