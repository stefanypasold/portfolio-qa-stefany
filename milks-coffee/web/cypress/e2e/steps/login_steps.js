import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import LoginPage from "../../support/pages/LoginPage.js";

Given("que eu acesso a página de login do painel", () => {
  LoginPage.acessar();
});

When("eu preencho o campo usuário com {string} e a senha com {string}", (usuario, senha) => {  
  LoginPage.preencherUsuario(usuario);
  LoginPage.preencherSenha(senha);
});

When("clico no botão de entrar", () => {
  LoginPage.clicarEntrar();
});

Then("eu devo ser redirecionado para o dashboard principal", () => {
  LoginPage.validarDashboard();
});