Feature: Gerenciamento de Estoque (Admin)
  Como um administrador logado
  Quero gerenciar os produtos do sistema
  Para manter o PDV atualizado

  Background:
    Given que estou logado como administrador

  Scenario: Cadastrar e excluir um produto com sucesso (Setup e Teardown)
    When eu cadastro um novo produto chamado "Bolo QA" no valor de "15.50"
    Then o produto "Bolo QA" deve aparecer na listagem de estoque
    When eu clico para excluir o produto "Bolo QA"
    Then o produto "Bolo QA" não deve mais estar na listagem