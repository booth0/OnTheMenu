describe('Review a Recipe', () => {
  beforeEach(() => {
    cy.login('cypress_review_user', 'TestPass123!')
  })

  it('should post a review on a recipe via API', () => {
    cy.request('GET', '/api/recipes').then((res) => {
      expect(res.body.length).to.be.greaterThan(0)
      const slug = res.body[0].slug

      cy.request('POST', `/api/recipes/${slug}/reviews`, {
        rating: 5,
        body: 'Absolutely delicious! Made it for dinner last night.',
      }).then((reviewRes) => {
        expect(reviewRes.status).to.eq(201)
        expect(reviewRes.body.rating).to.eq(5)
        expect(reviewRes.body.body).to.include('delicious')
      })
    })
  })

  it('should reject an invalid rating', () => {
    cy.request('GET', '/api/recipes').then((res) => {
      const slug = res.body[0].slug

      cy.request({
        method: 'POST',
        url: `/api/recipes/${slug}/reviews`,
        body: { rating: 0, body: 'Bad rating' },
        failOnStatusCode: false,
      }).then((reviewRes) => {
        expect(reviewRes.status).to.eq(400)
      })
    })
  })
})
