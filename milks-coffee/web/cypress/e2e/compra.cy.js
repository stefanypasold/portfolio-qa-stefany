import LoginPage from "../support/pages/LoginPage";

describe('Jornada do cliente', () => { 
    beforeEach(() => {
        LoginPage.acessar();
        LoginPage.preencherCredenciais("stefany", "123456");
        LoginPage.submeter();
        cy.url().should('include', '/loja');
    });

    it('Deve adicionar um item ao carrinho e finalizar a compra', () => {
        cy.intercept('POST', '**/vendas').as('apiPedido');

        cy.log('#### Adicionando produto ao carrinho ####');
        cy.get('[data-cy="btn-add-carrinho"]').first().should('be.visible').click();

        cy.log('#### Preenchendo CEP e selecionando pagamento ####');
        cy.get('[data-cy="input-cep"]').clear().type('12345-678');
        cy.get('[data-cy="select-pagamento"]').select('pix').should('have.value', 'pix');
        cy.log('#### Finalizando compra ####');
        cy.get('[data-cy="btn-finalizar-compra"]').click();

        cy.wait('@apiPedido').its('response.statusCode').should('be.oneOf', [200, 201]);
        cy.get('[data-cy="toast-mensagem-cliente"]').should('contain.text', 'sucesso');
        cy.get('[data-cy="msg-carrinho-vazio"]').should('be.visible'); 
    });
});