import { When, Then } from "@badeball/cypress-cucumber-preprocessor";

When("eu adiciono o primeiro item da vitrine à sacola", () => {
    cy.get('[data-cy="btn-add-carrinho"]').first().click();
    cy.get('[data-cy="lista-carrinho"]').children().should('have.length', 1);
});

When("preencho o CEP {string} e seleciono o pagamento {string}", (cep, pagamento) => {
    cy.get('[data-cy="input-cep"]').type(cep);
    cy.get('[data-cy="select-pagamento"]').select(pagamento);
});

When("clico em finalizar compra", () => {
    cy.get('[data-cy="btn-finalizar-compra"]').click();
});

Then("eu devo ver a mensagem de confirmação do pedido", () => {
    cy.get('[data-cy="toast-mensagem-cliente"]').should('contain', 'sucesso');
});

Then("minha sacola deve ficar vazia", () => {
    cy.get('[data-cy="msg-carrinho-vazio"]').should('be.visible');
});