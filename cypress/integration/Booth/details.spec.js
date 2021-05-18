describe('check page contents', () => {
  before(() => {
    cy.intercept('GET', '/booths').as('boothsPage')
    cy.visit('/login')
    cy
      .get('.MuiInputBase-input.MuiOutlinedInput-input')
      .eq(0)
      .type('whitehorse1990324@gmail.com')
      
    cy
      .get('.MuiInputBase-input.MuiOutlinedInput-input')
      .eq(1)
      .type('irfan_farrel')
    cy
      .get('[data-test="Login button"]')
      .click()
      .url({timeout: 20000}).should('include', '/booths')
  })

  context('detail page', () => {
    before(() => {
      cy.get('a > p').contains('Booth 1', {timeout: 20000})
        .click()
        .url({timeout: 20000}).should('include', '/booth-details?id=')
    })
    
    it('The title of the booth is present in the header', () => {
      cy.get('[data-test="Page header heading"]')
        .eq(0)
        .contains('Booth 1')
    })
  
    it('Related galleries are visible', () => {
      cy.contains('Gallery:')
    })

    it('Stop the booth', () => {
      cy.get('button > span').then(($buttons) => {
        const buttonText = $buttons[0].innerText;
        if(buttonText.includes('Stop')) {
          console.log('stop')
          cy.get('button')
            .eq(0)
            .contains('Stop')
            .click({ force: true })
        } else {
          console.log('start')
          cy.get('button')
            .eq(0)
            .contains('Start')
            .click({ force: true })
        }
      })
    })
  })
})