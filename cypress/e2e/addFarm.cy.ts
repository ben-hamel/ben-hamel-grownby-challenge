it("add farm to farm list", () => {
  cy.visit("/");
  cy.contains("Add farm").click();

  cy.get('[data-testid="displayName-input"]').should("be.visible");

  cy.get('[data-testid="phone"]').type("phone", { force: true });
  cy.get('[data-testid="displayName-input"]').type("Test farm");

  //   cy.get("element").should("not.be.disabled");
  //   cy.get('[data-testid="displayName-input"]').should("not.be.disabled");
  //   cy.get('[data-testid="displayName-input"]').type("test");
});

// it("test displayname", () => {
//   cy.get('[data-testid="displayName-input"]').type("farm display");
// });
