import LoginPage from "../pages/LoginPage";
import TodoPage from "../pages/TodoPage";

describe("Todo E2E - QACart", () => {
  it("Login -> Add Todo -> Complete Todo", () => {
    const email = Cypress.env("email");
    const password = Cypress.env("password");
    const todoText = `Todo ${Date.now()}`;

    LoginPage.visit();
    LoginPage.login(email, password);
    TodoPage.addTodo(todoText);
    TodoPage.assertTodoExists(todoText);

    TodoPage.markCompleted(todoText);
    TodoPage.assertTodoCompleted(todoText);
    TodoPage.deleteTodo(todoText);

  });
});
// auto build test
