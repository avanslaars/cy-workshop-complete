describe('Input Form', () => {
  beforeEach(() => {
    cy.seedAndVisit()
  })

  it('Auto focuses the input on load', () => {
    cy.focused().should('have.class', 'new-todo')
  })

  it('Accepts input', () => {
    cy
      .get('.new-todo')
      .type('Buy Milk')
      .should('have.value', 'Buy Milk')
  })

  context('Form Submission', () => {
    it('Submits on enter', () => {
      const itemText = 'Buy Milk'
      cy.route('POST', '/api/todos', {
        id: 1,
        name: itemText,
        isComplete: false
      })
      cy
        .get('.new-todo')
        .type(itemText)
        .type('{enter}')
    })

    it('Handles an error', () => {
      cy
        .route({
          method: 'POST',
          url: '/api/todos',
          status: 500,
          response: {}
        })
        .as('save')

      cy
        .get('.new-todo')
        .type('Anything')
        .type('{enter}')

      cy.wait('@save')

      cy.get('.todo-list li').should('not.exist')

      cy.get('.error').should('be.visible')
    })
  })
})
