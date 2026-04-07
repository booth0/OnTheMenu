describe('Save a Recipe', () => {
  beforeEach(() => {
    cy.login('cypress_save_user', 'TestPass123!')
  })

  it('should save and unsave a recipe via API', () => {
    // Get a recipe ID first
    cy.request('GET', '/api/recipes').then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body.length).to.be.greaterThan(0)

      const recipeId = res.body[0].id

      // Save
      cy.request('POST', '/api/recipes/save', { recipeId }).then((saveRes) => {
        expect(saveRes.status).to.eq(200)
        expect(saveRes.body.saved).to.eq(true)
      })

      // Unsave
      cy.request('DELETE', '/api/recipes/save', { recipeId }).then((unsaveRes) => {
        expect(unsaveRes.status).to.eq(200)
        expect(unsaveRes.body.saved).to.eq(false)
      })
    })
  })
})
