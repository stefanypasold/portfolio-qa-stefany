import { When, Then } from "@badeball/cypress-cucumber-preprocessor";

When("eu cadastro um novo produto chamado {string} no valor de {string}", (nome, preco) => {
    cy.get('[data-cy="input-nome"]').type(nome);
    cy.get('[data-cy="input-preco"]').type(preco);
    cy.get('[data-cy="input-qtd"]').type('10');
    cy.get('[data-cy="select-tipo"]').select('Loja');
    cy.get('[data-cy="btn-salvar"]').click();
});

Then("o produto {string} deve aparecer na listagem de estoque", (nome) => {
    cy.get('[data-cy="toast-mensagem"]').should('be.visible');
    cy.contains('strong', nome).should('be.visible');
});

When("eu clico para excluir o produto {string}", (nome) => {
    cy.contains('strong', nome)
        .parents('[data-cy^="produto-"]')
        .find('[data-cy="btn-excluir"]')
        .click();
    cy.on('window:confirm', () => true);
});

Then("o produto {string} não deve mais estar na listagem", (nome) => {
    cy.get('[data-cy="toast-mensagem"]').should('contain', 'excluído');
    cy.contains('strong', nome).should('not.exist');
});