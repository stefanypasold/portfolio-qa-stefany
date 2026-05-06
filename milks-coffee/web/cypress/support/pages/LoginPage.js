class LoginPage {
    acessar() {
        cy.visit('/'); 
    }

    preencherCredenciais(usuario, senha) {
        cy.get('[data-cy="input-username"]').clear().type(usuario);
        cy.get('[data-cy="input-password"]').clear().type(senha, { log: false });
    }

    submeter() {
        cy.get('[data-cy="btn-entrar"]').click();
    }

    validarErro(mensagem) {
        cy.get('[data-cy="msg-erro-login"]').should('be.visible').and('contain.text', mensagem);
    }
}

export default new LoginPage();