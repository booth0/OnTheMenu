describe('Like a Recipe', () => {
  beforeEach(() => {
    cy.login('cypress_like_user', 'TestPass123!')
  })

  it('should toggle like on a recipe via API', () => {
    // Get a recipe slug first
    cy.request('GET', '/api/recipes').then((res) => {
      expect(res.body.length).to.be.greaterThan(0)
      const slug = res.body[0].slug

      // Like
      cy.request('POST', `/api/recipes/${slug}/like`).then((likeRes) => {
        expect(likeRes.status).to.eq(200)
        expect(likeRes.body).to.have.property('liked')
      })

      // Toggle off
      cy.request('POST', `/api/recipes/${slug}/like`).then((unlikeRes) => {
        expect(unlikeRes.status).to.eq(200)
        expect(unlikeRes.body).to.have.property('liked')
      })
    })
  })
})
