describe('Recipe Books', () => {
  beforeEach(() => {
    cy.login('cypress_book_user', 'TestPass123!')
  })

  it('should create a new recipe book', () => {
    cy.visit('/recipe-books/new')
    cy.get('main form input[type="text"]').type('My Cypress Book')
    cy.get('main form button[type="submit"]').click()
    cy.url().should('include', '/recipe-books')
    cy.contains('My Cypress Book').should('be.visible')
  })
})
