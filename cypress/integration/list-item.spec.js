describe('List Items', () => {
  beforeEach(() => {
    cy.seedAndVisit('fixture:mixed_todos')
  })

  it('properly displays completed items', () => {
    cy.get('.todo-list li')
      .filter('.completed')
      .should('have.length', 1)
      .and('contain', 'Eggs') // and is an alias for should
      .find('.toggle')
      .should('be.checked')
  })

  it('Shows remaining todos in the footer', () => {
    cy.get('.todo-count')
      .should('contain', 3) // we know this should be 3 because we control the data w/ a fixture
  })

  it('Deletes an item', () => {
    cy
      .route({
        method: 'DELETE',
        url: '/api/todos/*',
        status: 200,
        response: {}
      })
      .as('delete')

    cy
      .get('.todo-list li')
      .first()
      .find('.destroy') // find a child of the current subject
      .invoke('show') // show the element so it can be interacted with
      .click()

    cy.wait('@delete')

    cy.get('.todo-list li')
      .should('have.length', 3)
      .and('not.contain', 'Buy Milk') // and is an alias for `should`


  })

  it('Marks an incomplete item complete', () => {
    // Load a fixture
    cy.fixture('mixed_todos')
      .then(todos => {
        // Cypress._ exposes lodash in your test
        const target = Cypress._.head(todos)
        // Use the item to setup a specific route w/ appropriate return
        cy.route(
          'PUT',
          `/api/todos/${target.id}`,
          Cypress._.merge(target, {isComplete: true})
        )
      })

    cy.get('.todo-list li')
      .first()
      .as('first-todo')

    cy.get('@first-todo')
      .find('.toggle')
      .click()
      .should('be.checked')

    cy.get('@first-todo')
      .should('have.class', 'completed')

    cy.get('.todo-count')
      .should('contain', 2)
  })
})
