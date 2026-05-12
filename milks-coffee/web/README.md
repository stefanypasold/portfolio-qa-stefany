# 💻 Automação Web | Milk's Coffee (Cypress)

Este módulo é dedicado à garantia de qualidade do painel administrativo (Web) do Milk's Coffee. A suíte foi desenvolvida em **Cypress**, focando em testes de alta performance e validações de API integradas à interface.

---

## 🏗️ Estratégia de Qualidade

A arquitetura foi desenhada para um nível pleno de automação:
* **Page Object Model (POM):** Centralização da lógica de interação com o DOM, garantindo que mudanças no layout não quebrem a suíte inteira.
* **Interceptação de API (Network Testing):** Uso de `cy.intercept` para validar se o Front-end e o Back-end estão conversando corretamente (Status Codes e Payloads).
* **Asserções Explícitas:** Uso de `expect` para validações mais granulares de propriedades e estados dos elementos.

---

## 🎯 Cobertura de Testes
* **Autenticação:** Validação de login com sucesso e tratamento de erros (401 Unauthorized).
* **Gestão de Inventário:** Fluxo completo de cadastro e exclusão de produtos no estoque.
* **Carrinho de Compras:** Jornada do cliente desde a vitrine até o checkout com sucesso.