describe('Smoke tests', () => {
  beforeEach(() => {
    cy.request('DELETE', '/api/todos/all')
    cy.server()
  })

  context('With no todos', () => {
    it('Saves new todos', () => {
      const items = [
        {text: 'Buy milk', expectedLength: 1},
        {text: 'Buy eggs', expectedLength: 2},
        {text: 'Buy bread', expectedLength: 3}
      ]
      cy.visit('/')
      cy.server()
      cy.route('POST', '/api/todos')
        .as('create')

      cy.wrap(items)
        .each(todo => {
          cy.focused()
            .type(todo.text)
            .type('{enter}')

          cy.wait('@create')

          cy.get('.todo-list li')
            .should('have.length', todo.expectedLength)
        })
    })
  })

  context('With active todos', () => {
    beforeEach(() => {
      cy.fixture('incomplete_todos')
        .then(todos => cy.request('POST', '/api/todos/bulkload', { todos }))

      cy.route('GET', '/api/todos')
        .as('load')

      cy.visit('/')

      cy.wait('@load')
    })

    it('Loads existing data from the DB', () => {
      cy.get('.todo-list li')
        .should('have.length', 4)
    })

    it('Deletes todos', () => {
      cy.route('DELETE', '/api/todos/*')
        .as('delete')

      cy.get('.todo-list li')
        .each($el => {
          cy.wrap($el)
            .find('.destroy')
            .invoke('show')
            .click()

          cy.wait('@delete')
        })
        .should('not.exist')
    })

  it('Toggles todos', () => {
    const clickAndWait = ($el) => {
      cy.wrap($el)
        .as('item')
        .find('.toggle')
        .click()

      cy.wait('@update')
    }

    cy.route('PUT', '/api/todos/*')
      .as('update')

    cy.get('.todo-list li')
      .each($el => {
        clickAndWait($el)
        cy.get('@item')
          .should('have.class', 'completed')
      })
      .each($el => {
        clickAndWait($el)
        cy.get('@item')
          .should('not.have.class', 'completed')
      })
    })
  })
})