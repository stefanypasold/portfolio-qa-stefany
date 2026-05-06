Feature: Autenticação no Sistema
  Como um usuário do sistema
  Quero realizar login
  Para acessar meu perfil adequado

  Scenario: Caminho Triste - Login com credenciais inválidas
    Given que eu acesso a página de login
    When eu insiro o usuário "hacker" e a senha "senhaerrada"
    And clico em entrar
    Then eu devo ver a mensagem de erro "Usuário ou senha inválidos"

  Scenario: Caminho Feliz - Login de Administrador
    Given que eu acesso a página de login
    When eu insiro o usuário "admin" e a senha "123"
    And clico em entrar
    Then eu devo ser redirecionado para o painel do PDV

  Scenario: Caminho Feliz - Login de Cliente
    Given que eu acesso a página de login
    When eu insiro o usuário "stefany" e a senha "123456"
    And clico em entrar
    Then eu devo ser redirecionado para a vitrine da Loja