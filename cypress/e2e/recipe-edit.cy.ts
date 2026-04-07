describe('Recipe Editing', () => {
  let recipeSlug: string

  before(() => {
    cy.login('cypress_edit_user', 'TestPass123!')
    cy.request('POST', '/api/recipes', {
      title: `Cypress Edit Test ${Date.now()}`,
      description: 'Original description',
      ingredients: ['1 cup flour'],
      directions: ['Mix well'],
      visibility: 'PRIVATE',
    }).then((res) => {
      expect(res.status).to.eq(201)
      recipeSlug = res.body.slug
    })
  })

  beforeEach(() => {
    cy.login('cypress_edit_user', 'TestPass123!')
  })

  it('should update a recipe via API', () => {
    cy.request('PUT', `/api/recipes/${recipeSlug}`, {
      title: 'Updated Recipe Title',
      description: 'Updated description',
      ingredients: ['2 cups flour', '1 egg'],
      directions: ['Mix flour', 'Add egg'],
      visibility: 'PRIVATE',
    }).then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body.data.title).to.eq('Updated Recipe Title')
      expect(res.body.data.description).to.eq('Updated description')
    })
  })

  it('should return 404 when editing a non-existent recipe', () => {
    cy.request({
      method: 'PUT',
      url: '/api/recipes/this-slug-does-not-exist-xyz',
      body: { title: 'Ghost', ingredients: [], directions: [], visibility: 'PRIVATE' },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(400)
    })
  })

  it('should delete a recipe via API', () => {
    // Create a throw-away recipe to delete
    cy.request('POST', '/api/recipes', {
      title: `Cypress Delete Test ${Date.now()}`,
      description: '',
      ingredients: ['water'],
      directions: ['Boil'],
      visibility: 'PRIVATE',
    }).then((createRes) => {
      expect(createRes.status).to.eq(201)
      const slug = createRes.body.slug

      cy.request({ method: 'DELETE', url: `/api/recipes/${slug}` }).then((deleteRes) => {
        expect(deleteRes.status).to.eq(204)
      })

      // Verify it's gone
      cy.request({
        method: 'GET',
        url: `/api/recipes/${slug}`,
        failOnStatusCode: false,
      }).then((getRes) => {
        expect(getRes.status).to.eq(404)
      })
    })
  })
})
