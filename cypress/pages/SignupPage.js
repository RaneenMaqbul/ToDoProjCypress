class SignupPage {
  visit() {
    cy.visit("https://todo.qacart.com/signup");
  }

  get firstNameInput() {
    return cy.get('[data-testid="first-name"]');
  }

  get lastNameInput() {
    return cy.get('[data-testid="last-name"]');
  }

  get emailInput() {
    return cy.get('[data-testid="email"]');
  }

  get passwordInput() {
    return cy.get('[data-testid="password"]');
  }

  get confirmPasswordInput() {
    return cy.get('[data-testid="confirm-password"]');
  }
  get signupButton() {
    return cy.get('[data-testid="submit"]');
  }

  register(user) {
    this.firstNameInput.type(user.firstName);
    this.lastNameInput.type(user.lastName);
    this.emailInput.type(user.email);
    this.passwordInput.type(user.password);
    this.confirmPasswordInput.type(user.password);
    this.signupButton.click();
  }
}

export default new SignupPage();
