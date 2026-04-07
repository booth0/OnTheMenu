describe('Search Recipes', () => {
  it('should find recipes matching a query', () => {
    cy.visit('/search?query=spaghetti')
    cy.contains('Spaghetti', { matchCase: false }).should('exist')
  })

  it('should show no results for a nonsense query', () => {
    cy.visit('/search?query=xyznonexistent999')
    cy.contains('No recipes found').should('be.visible')
  })
})
