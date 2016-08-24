const path = require('path');

let phantom
let page

require('phantom').create()
  .then(instance => {
    phantom = instance
    return phantom.createPage()
  })
  .then(p => {
    page = p
    page.property('viewportSize', {width: 1920, height: 1080})
    const url = `file://${path.join(__dirname, 'example/index.html')}`
    console.log('Opening: ', url)
    return page.open(url)
  })
  .then(status => {
    console.log('Status: ', status)
    if (status === 'success') {
      const repeat = () => {
        page.evaluate(function() {
          return window.isReady()
        }).then(isReady => {
          if (isReady) {
            console.log('Generating PDF')
            page.render('capture.pdf')
            page.close()
            phantom.exit()
          } else {
            setTimeout(repeat, 1000)
          }
        })
      }
      repeat()
    } else {
      page.close()
      phantom.exit()
    }
  })
  .catch(error => {
    phantom.exit()
  })
