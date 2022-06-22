it("works", () => {
  cy.visit("/");
  cy.get("[data-testid=email-input]").type("benehamel@gmail.com");
  cy.get("[data-testid=password-input]").type("password");
  cy.contains("Login").click();
});
