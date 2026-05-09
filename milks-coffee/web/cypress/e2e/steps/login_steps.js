import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import LoginPage from "../../support/pages/LoginPage.js";

Given("que eu acesso a página de login", () => {
    cy.log('#### Acessando a URL base ####');
    LoginPage.acessar();
});

When("eu insiro o usuário {string} e a senha {string}", (usuario, senha) => {
    // Interceptamos a chamada de login para validar o status code depois
    cy.intercept('POST', '**/login').as('postLogin');
    
    cy.log(`#### Tentando login com: ${usuario} ####`);
    LoginPage.preencherCredenciais(usuario, senha);
});

When("clico em entrar", () => {
    LoginPage.submeter();
});

Then("eu devo ver a mensagem de erro {string}", (mensagem) => {
    // Validação PRO: Espera o erro 401 do servidor antes de checar a UI
    cy.wait('@postLogin').its('response.statusCode').should('eq', 401);
    
    LoginPage.validarErro(mensagem);
});

Then("eu devo ser redirecionado para o painel do PDV", () => {
    cy.wait('@postLogin').its('response.statusCode').should('eq', 200);
    
    cy.url().should('include', '/pdv');
    cy.get('[data-cy="titulo-painel-admin"]').should(($el) => {
        expect($el).to.be.visible;
        expect($el.text()).to.match(/Painel|PDV/i); // Flexibilidade no texto
    });
});

Then("eu devo ser redirecionado para a vitrine da Loja", () => {
    cy.wait('@postLogin').its('response.statusCode').should('eq', 200);
    
    cy.url().should('include', '/loja');
    cy.get('[data-cy="titulo-loja-cliente"]').should('be.visible');
});

// Reutilização com comandos de log para o vídeo
Given("que estou logado como administrador", () => {
    cy.log('#### Setup: Logando como Admin ####');
    LoginPage.acessar();
    LoginPage.preencherCredenciais("admin", "123");
    LoginPage.submeter();
});