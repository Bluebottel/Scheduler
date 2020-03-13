import React, { Component } from 'react'
import Joyride from 'react-joyride'

class PackageTour extends Component {
  constructor(props) {
    super(props)
  }

  steps = [
    {
      target: '#cogButton',
      content: 'Press me!',
      disableBeacon: true,
      placement: 'left-end',
    },
    
    {
      target: 'div.modalPanel:nth-child(2) > div:nth-child(2)',
      content: 'Moar',
      disableBeacon: true,
    }
  ]
  

  render() {
    return (
      <Joyride
	run = { true }
	showProgress = { true }
	showSkipButton = { true }
	steps = { this.steps }
	continous = { true }
        showProgress = { true }
        spotlightPadding = { 20 }
      />
    )
  }
}

export default PackageTour
