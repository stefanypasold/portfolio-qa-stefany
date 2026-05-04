import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import LoginPage from "../../support/pages/LoginPage.js";

Given("que eu acesso a página de login", () => {
    LoginPage.acessar();
});

When("eu insiro o usuário {string} e a senha {string}", (usuario, senha) => {
    LoginPage.preencherCredenciais(usuario, senha);
});

When("clico em entrar", () => {
    LoginPage.submeter();
});

Then("eu devo ver a mensagem de erro {string}", (mensagem) => {
    LoginPage.validarErro(mensagem);
});

Then("eu devo ser redirecionado para o painel do PDV", () => {
    cy.url().should('include', '/pdv');
    cy.get('[data-cy="titulo-painel-admin"]').should('be.visible');
});

Then("eu devo ser redirecionado para a vitrine da Loja", () => {
    cy.url().should('include', '/loja');
    cy.get('[data-cy="titulo-loja-cliente"]').should('be.visible');
});

// Passos de Background para reutilização
Given("que estou logado como administrador", () => {
    LoginPage.acessar();
    LoginPage.preencherCredenciais("admin", "123");
    LoginPage.submeter();
});

Given("que estou logado como cliente", () => {
    LoginPage.acessar();
    LoginPage.preencherCredenciais("stefany", "123456");
    LoginPage.submeter();
});