describe('Featured Recipes', () => {
  it('should display featured recipes on the home page', () => {
    cy.visit('/')
    cy.contains('Featured Recipes').should('be.visible')
  })

  it('should return top recipes from the API', () => {
    cy.request('GET', '/api/recipes/featured').then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body).to.be.an('array')
      expect(res.body.length).to.be.at.most(5)
    })
  })
})
