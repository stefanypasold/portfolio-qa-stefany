class LoginPage {
  acessar() {
    cy.visit('/');
  }

  preencherUsuario(usuario) {
    cy.get('input[type="email"]').type(usuario);
  }

  preencherSenha(senha) {
    cy.get('input[type="password"]').type(senha);
  }

  clicarEntrar() {
    cy.contains('button','Entrar no Sistema').click();
  }

  validarDashboard() {
    cy.url().should('include', '/dashboard');
    cy.contains('Dashboard').should('be.visible');
  }
}

export default new LoginPage();