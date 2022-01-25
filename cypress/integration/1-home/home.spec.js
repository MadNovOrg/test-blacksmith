describe('home page', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('displays two todo items by default', () => {
    cy.get('.font-bold').should('have.length', 1)
    cy.get('.font-bold').first().should('have.text', 'Home page')
  })
})
