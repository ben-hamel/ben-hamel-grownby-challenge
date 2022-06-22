it("add farm to farm list", () => {
  cy.visit("/");
  cy.contains("Add farm").click();

  cy.get('[data-testid="display-name-input"]').should("be.visible");
  cy.get('[data-testid="display-name-input"]').type("Test farm", {
    force: true,
  });
  cy.get('[data-testid="farm-name-input"]').type("Test Name", {
    force: true,
  });
  cy.get('[data-testid="phone-input"]').type("7096906846", {
    force: true,
  });
  cy.get('[data-testid="open-hours-input"]').type("9-5", {
    force: true,
  });

  cy.get('[data-testid="add-farm-image-button"]').click({ multiple: true });
  cy.get('[data-testid="submit-button"]').click();
});
