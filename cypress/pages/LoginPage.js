class LoginPage {
  visit() {
    cy.visit("https://todo.qacart.com/");
  }

  get emailInput() {
    // TODO: حطي selector الصحيح (غالباً data-testid)
    return cy.get('[data-testid="email"]');
  }

  get passwordInput() {
    // مذكور بأمثلة شبيهة إنه موجود data-testid="password"
    return cy.get('[data-testid="password"]');
  }

  get loginButton() {
    // TODO: حطي selector زر login
    return cy.get('[data-testid="submit"]');
  }

  login(email, password) {
    this.emailInput.clear().type(email);
    this.passwordInput.clear().type(password);
    this.loginButton.click();
  }
}

export default new LoginPage();
