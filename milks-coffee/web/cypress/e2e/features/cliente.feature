Feature: Fluxo de E-commerce (Cliente)
  Como um cliente logado
  Quero adicionar produtos na sacola e finalizar pedido
  Para realizar uma compra

  Background:
    Given que estou logado como cliente

  Scenario: Adicionar produto e finalizar checkout
    When eu adiciono o primeiro item da vitrine à sacola
    And preencho o CEP "89200-000" e seleciono o pagamento "pix"
    And clico em finalizar compra
    Then eu devo ver a mensagem de confirmação do pedido
    And minha sacola deve ficar vazia