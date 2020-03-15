import React, { Component } from 'react'
import Joyride from 'react-joyride'

class PackageTour extends Component {
  constructor(props) {
    super(props)

  }

  steps = [
    {
      target: 'body',
      title: 'Första gången rundvandring',
      content: 'En kort genomgång av alla funktionaliteter.',
      placement: 'center',
    },
    
    {
      target: '#cogButton',
      content: 'Klicka på kugghjulet för att öppna huvudmenyn.',
      disableBeacon: true,
      placement: 'top-start',
      hideCloseButton: true,
      disableOverlayClose: true,
      hideFooter: true,
      spotlightClicks: true,
    },
    
    {
      target: 'div.modalPanel:nth-child(2)',
      content: '',
    },
    
    {
      target: 'div.modalPanel:nth-child(3)',
      content: 'shifts',
    },
    
    {
      target: 'div.modalPanel:nth-child(4)',
      content: 'storage',
    },
    
    {
      target: 'div.modalPanel:nth-child(5)',
      content: 'rules',
    },

    {
      target: '#closeBubble',
      content: 'close with esc or here',
      placement: 'top-start',
      hideCloseButton: true,
      disableOverlayClose: true,
      hideFooter: true,
      spotlightClicks: true,
    },

    {
      target: '#sideContainer',
      content: 'Changes here, note marked',
      placement: 'left',
    },

    {
      target: 'div.rbc-month-row:nth-child(4) > div:nth-child(1) > div:nth-child(4)',
      content: 'click here to add',
      placement: 'bottom',
    },

    {
      target: 'span.rbc-btn-group:nth-child(3) > button:nth-child(2)',
      content: 'goto week',
      placement: 'bottom',
      hideCloseButton: true,
      disableOverlayClose: true,
      hideFooter: true,
      spotlightClicks: true,
    },

    {
      target: 'div.rbc-day-slot:nth-child(4) > div:nth-child(13)',
      content: 'click and drag to add',
      hideCloseButton: true,
      disableOverlayClose: true,
      hideFooter: true,
      spotlightClicks: true,
    },

    {
      target: '.ReactModal__Content',
      content: 'do stuff',
      placement: 'left',
      offset: 100,
      hideCloseButton: true,
      disableOverlayClose: true,
      hideFooter: true,
      spotlightClicks: true,
      disableOverlay: true,
    },

    {
      target: 'body',
      content: 'done!',
      placement: 'center',
    }

  ]

  handleCallback = arg => {
    if (arg.type === 'step:after')
      this.props.setStep(arg.index+1)

    if (arg.action === 'skip')
      this.props.done()
  }

  render() {
    return (
      <Joyride
	disableOverlayClose = { true }
	showSkipButton = { true }
	steps = { this.steps }
	stepIndex = { this.props.stepIndex }
	locale = {{
	  next: 'Nästa',
	  skip: 'Hoppa över',
	  last: 'Klar',
	}}
	callback = { this.handleCallback }
	hideBackButton = { true }
	disableBeacon = { true }
	continuous = { true }
	run = { this.props.run }
      />
    )
  }
}

export default PackageTour
