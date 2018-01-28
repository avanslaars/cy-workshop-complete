Cypress.Commands.add('seedAndVisit', (seedData = []) => {
  cy.server()
  cy.route('GET', '/api/todos', seedData)
    .as('load')

  cy.visit('/') // This works because baseUrl is set in cypress.json

  cy.wait('@load')
})
