import { Decoder } from '@nuintun/qrcode';
const qrcode = new Decoder();

describe('check page contents', () => {
  before(() => {
    cy.loginByUsernamePassword();
  })

  context('detail page', () => {
    before(() => {
      cy.get('a > p').contains('Booth 1', {timeout: 20000})
        .click()
        .url({timeout: 20000}).should('include', '/booth-details?id=')
    })

    beforeEach(() => {
      cy.wait(500)
    })
    
    it('The title of the booth is present in the header', () => {
      cy.get('[data-test="Page header heading"]')
        .eq(0)
        .contains('Booth 1')
        .should('be.visible')
    })
  
    it('Related galleries are visible', () => {
      cy.contains('Gallery:')
      cy.get('span > a')
        .eq(0)
        .contains('Gallery 1-1')
        .should('be.visible')
    })

    it('Stop/Start the booth', () => {
      cy.get('button > span').then(($buttons) => {
        const buttonText = $buttons[0].innerText;
        if(buttonText.includes('Stop')) {
          console.log('stop')
          cy.get('button')
            .eq(0)
            .contains('Stop')
            .trigger("click")
        } else {
          console.log('start')
          cy.get('button')
            .eq(0)
            .contains('Start')
            .trigger("click")
        }
      })
    })

    it('Captured link hould be present on the page', () => {
      cy.get('*[placeholder="https://virtual.doitselfie.eu/your-booth-link"]')
        .invoke('val')
        .then(urlStr => {
          expect(urlStr).to.equal("https://virtual.develop.doitselfie.eu/koda5aoi/a467edec-b4c0-4027-a34b-164811bc8fd2")
          
          return urlStr
        })
        .then((urlStr) => {
          cy.request(urlStr).its('body').should('include', 'Booth 1</h1>')
        })        
    })

    it('check publish button (I will test by changing subheading)', () => {
      let boothTitle = 'Subheading of Booth 1';
      cy.get('*[placeholder^="Snap & share your selfie!"]')
        .eq(0)
        .wait(3000)
        .clear()
        .type(boothTitle)

      cy.get('*[class^="MuiButton-label-"]')
        .contains('Publish')
        .trigger("click")
        .then(() => {
          cy.get('*[role="progressbar"]').should('be.visible', true)
        })
        
      cy.wait(35000)

      cy.get('*[class^="MuiFormControl-root"]')
        .find('input[type="text"]')
        .eq(0)
        .invoke('val')
        .then((urlStr) => {
          cy.request(urlStr).its('body').should('include', 'Subheading of Booth 1</h2>')
        })
    })

    it('Takes QR Code Screenshot, check its path', () => {
      cy.get('canvas').screenshot('qrcode', {
        onAfterScreenshot($el, props) {
          expect(props.path).to.match(/cypress-trial\/cypress\/screenshots\/Booth\/details.spec.js/i)
        }
      })
    })

  })
})