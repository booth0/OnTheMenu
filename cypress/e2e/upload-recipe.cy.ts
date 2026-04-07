describe('Upload Recipe', () => {
  beforeEach(() => {
    cy.login('cypress_upload_user', 'TestPass123!')
  })

  it('should create a new recipe via API', () => {
    const title = `Cypress Test Recipe ${Date.now()}`
    cy.request('POST', '/api/recipes', {
      title,
      description: 'A recipe created by Cypress',
      ingredients: ['1 cup flour'],
      directions: ['Mix everything together'],
      visibility: 'PUBLIC',
    }).then((res) => {
      expect(res.status).to.eq(201)
      expect(res.body).to.have.property('slug')

      // Verify the recipe page renders correctly
      cy.visit(`/recipe/${res.body.slug}`)
      cy.contains(title, { timeout: 10000 }).should('be.visible')
    })
  })
})
