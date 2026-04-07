describe('Moderation', () => {
  it('should return 401 for unauthenticated requests to moderation API', () => {
    cy.clearCookies()
    cy.request({
      method: 'GET',
      url: '/api/moderation/recipes',
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(401)
    })
  })

  it('should return 403 for a regular user accessing moderation API', () => {
    cy.login('cypress_mod_regular_user', 'TestPass123!')
    cy.request({
      method: 'GET',
      url: '/api/moderation/recipes',
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(403)
    })
  })

  it('should redirect unauthenticated users from /moderation page to /login', () => {
    cy.clearCookies()
    cy.visit('/moderation')
    cy.url().should('include', '/login')
  })
})
