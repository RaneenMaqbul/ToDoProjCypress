import SignupPage from "../pages/SignupPage";

describe("Register - QACart Todo", () => {

  beforeEach(() => {
    cy.fixture("register").as("user");
  });

  it("User can register successfully", function () {

    const randomEmail = `raneen_${Date.now()}@test.com`;

    const userData = {
      firstName: this.user.firstName,
      lastName: this.user.lastName,
      email: randomEmail,
      password: this.user.password
    };

    SignupPage.visit();
    SignupPage.register(userData);

    // ✅ Assertion بعد التسجيل
    cy.url().should("not.include", "signup");
    cy.contains("Todo", { timeout: 10000 }).should("be.visible");
  });
});
