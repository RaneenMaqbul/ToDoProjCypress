class TodoPage {
  get newTodoInput() {
    // TODO: selector input تبع إضافة todo
    return cy.get('[data-testid="new-todo"]');
  }

  
  get addTodoButton() {
    // TODO: selector زر الإضافة
    return cy.get('[data-testid="add"]');
  }
  get createTodoButton(){
    return cy.get('[data-testid="submit-newTask"]')
  }

  
  addTodo(text) {
    this.addTodoButton.click();
    this.newTodoInput.type(text);
    this.createTodoButton.click();

  }

  assertTodoExists(text) {
    cy.contains(text).should("be.visible");
  }

  markCompleted(text) {
    // فكرة عامة: جيبي العنصر اللي فيه النص وبجوّاته checkbox
    cy.contains(text)
      .parents('[data-testid="todo-item"]')   // TODO: عدلي حسب DOM
      .find('input[type="checkbox"]')
      .check({ force: true });
  }

assertTodoCompleted(text) {
  cy.contains('[data-testid="todo-text"]', text)
    .parents('[data-testid="todo-item"]')
    .find('[data-testid="complete-task"]')
    .should('be.checked');
}

deleteTodo(text) {
  cy.contains('[data-testid="todo-text"]', text)
    .parents('[data-testid="todo-item"]')
    .find('[data-testid="delete"]')
    .click();
}


}

export default new TodoPage();
