import LoginPage from "../support/pages/LoginPage.js";

describe('Gestão de Inventário (Admin)', () => {
  beforeEach(() => {
    LoginPage.acessar();
    LoginPage.preencherCredenciais("admin", "123");
    LoginPage.submeter();
  });

 it('Deve cadastrar e excluir um produto', () => {
    // 1. CORREÇÃO: Mudamos de 'produtos' para 'estoque'
    cy.intercept('POST', '**/estoque').as('saveProduct');
    cy.intercept('DELETE', '**/estoque/*').as('deleteProduct');

    // Cadastro
    cy.get('[data-cy="input-nome"]').type('Novo Café Teste');
    cy.get('[data-cy="input-preco"]').type('25.00');
    cy.get('[data-cy="input-qtd"]').type('10');
    cy.get('[data-cy="select-tipo"]').select('Loja');
    cy.get('[data-cy="btn-salvar"]').click();
    
    // 2. CORREÇÃO: Mudamos a espera para 200, que é o que sua API retorna
    cy.wait('@saveProduct').its('response.statusCode').should('eq', 200);

    // Exclusão
    cy.contains('strong', 'Novo Café Teste')
      .parents('[data-cy^="produto-"]')
      .find('[data-cy="btn-excluir"]').click();
    
    cy.on('window:confirm', () => true);
    
    // Espera a rota da API terminar com sucesso
    cy.wait('@deleteProduct').its('response.statusCode').should('be.oneOf', [200, 204]);
    
    // Valida que a notificação de exclusão apareceu 
    cy.get('[data-cy="toast-mensagem"]').should('be.visible');

    // Busca o texto dentro dos blocos de produto
    cy.get('body').then(($body) => {
        if ($body.find('[data-cy^="produto-"]').length > 0) {
            cy.get('[data-cy^="produto-"]').contains('Novo Café Teste').should('not.exist');
        }
    });
    
  });
});