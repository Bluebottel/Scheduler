import React, { Component } from 'react'
import Joyride from 'react-joyride'

class PackageTour extends Component {
  constructor(props) {
    super(props)

    let nextStep = new Map()

    nextStep.set(0, this.props.parentState.optionsModalOpen ? 1 : 0)

    nextStep.set(1, false)
    nextStep.set(2, false)

    this.state = {
      nextStep: nextStep,
    }
  }

  steps = [
    {
      target: '#cogButton',
      content: 'Press me!',
      disableBeacon: true,
      placement: 'top-start',
      hideCloseButton: false,
      disableOverlayClose: true,
      hideFooter: false,
      spotlightClicks: true,
    },
    
    {
      target: 'div.modalPanel:nth-child(2)',
      content: 'Moar',
      disableBeacon: true,
    },
    {
      target: 'div.modalPanel:nth-child(3)',
      content: 'even more stuff',
      disableBeacon: true,
      
    }
  ]

  specialStep = step => {
    if (step === 0 && this.props.parentState.optionsModalOpen)
      return 1
    else return step
  }
  
  handleCallback = arg => {
    console.log('callback: ', arg)
    if (arg.lifecycle === 'ready' && arg.action === 'next'
     && arg.type === 'step:before')
      return arg.index
    
    if (arg.type === 'step:after')
      this.props.setStep(arg.index)
    if (arg.index === this.specialStep(arg.index))
      this.props.setStep(arg.index)
    else this.props.setStep(this.specialStep(arg.index))


  
  }

  render() {
    console.log('render ride')
    return (
      <Joyride
	disableOverlayClose = { true }
	showSkipButton = { true }
	steps = { this.steps }
	stepIndex = { this.specialStep(this.props.stepIndex) }
	locale = {{
	  close: 'Nästa',
	}}
	run = { this.state.run }
	callback = { this.handleCallback }
      />
    )
  }
}

export default PackageTour
