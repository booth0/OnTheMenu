describe('Review a Recipe', () => {
  let recipeSlug: string

  before(() => {
    // Create a dedicated recipe so the (recipeId, userId) pair is always
    // fresh — avoids the @@unique constraint failing on repeated test runs.
    cy.login('cypress_review_user', 'TestPass123!')
    cy.request('POST', '/api/recipes', {
      title: `Review Test Recipe ${Date.now()}`,
      description: 'Created by Cypress for review testing',
      ingredients: ['1 egg'],
      directions: ['Cook it'],
      visibility: 'PUBLIC',
    }).then((res) => {
      expect(res.status).to.eq(201)
      recipeSlug = res.body.slug
    })
  })

  beforeEach(() => {
    cy.login('cypress_review_user', 'TestPass123!')
  })

  it('should post a review on a recipe via API', () => {
    cy.request('POST', `/api/recipes/${recipeSlug}/reviews`, {
      rating: 5,
      body: 'Absolutely delicious! Made it for dinner last night.',
    }).then((reviewRes) => {
      expect(reviewRes.status).to.eq(201)
      expect(reviewRes.body.rating).to.eq(5)
      expect(reviewRes.body.body).to.include('delicious')
    })
  })

  it('should reject an invalid rating', () => {
    cy.request({
      method: 'POST',
      url: `/api/recipes/${recipeSlug}/reviews`,
      body: { rating: 0, body: 'Bad rating' },
      failOnStatusCode: false,
    }).then((reviewRes) => {
      expect(reviewRes.status).to.eq(400)
    })
  })
})
