import LoginPage from "../support/pages/LoginPage.js";

describe('Autenticação', () => {
  beforeEach(() => {
    LoginPage.acessar();
    cy.intercept('POST', '**/login').as('postLogin');
  });

  it('Deve exibir erro ao inserir credenciais inválidas', () => {
    LoginPage.preencherCredenciais("usuario_errado", "senha_errada");
    LoginPage.submeter();

    cy.wait('@postLogin').its('response.statusCode').should('eq', 401);
    LoginPage.validarErro('Usuário ou senha inválidos');
  });

  it('Deve logar como Administrador e ir para o PDV', () => {
    LoginPage.preencherCredenciais("admin", "123");
    LoginPage.submeter();

    cy.wait('@postLogin').its('response.statusCode').should('eq', 200);
    cy.url().should('include', '/pdv');
    cy.get('[data-cy="titulo-painel-admin"]').should('be.visible');
  });
});