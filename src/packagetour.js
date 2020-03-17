import React, { Component } from 'react'
import Joyride from 'react-joyride'

import addBubble from './img/plus.png'

class PackageTour extends Component {
  constructor(props) {
    super(props)

  }

  steps = [
    {
      target: 'body',
      title: 'Introduktion',
      content: 'En kort genomgång av alla funktionaliteter.',
      placement: 'center',
    },

    {
      target: '#sideContainer',
      content: 'För tillfället kommer inget att hända om du klickar'
	     + ' på rutorna i kalendern eftersom inga pass eller resurser är tillagda.',
      placement: 'left',
    },
    
    {
      target: '#cogButton',
      content: 'Pass och resurser läggs till i huvudmenyn. Klicka här för att öppna den.',
      placement: 'top-start',
      hideFooter: true,
      spotlightClicks: true,
    },
    
    {
      target: 'div.modalPanel:nth-child(2)',
      content: (
	<div>
	  Klicka på
	  <img
	    src = { addBubble }
	    alt = 'Plus sign'
	    style = {{
	      width: '20px',
	      display: 'inline',
	      margin: '0px 5px -4px 5px',
	    }}
	  />
	  för att lägga till en resurs. Resursen kommer att skapas med förifyllda
	  värden som kan ändras genom att klicka på dem. Ändra ett värde för att
	  fortsätta.
	</div>
      ),
      hideFooter: true,
      spotlightClicks: true,
    },
    
    {
      target: 'div.modalPanel:nth-child(3)',
      content: 'Pass läggs till på samma sätt som resurser. Ändra ett värde'
	     + ' för att fortsätta',
      hideFooter: true,
      spotlightClicks: true,
    },
    
    {
      target: 'div.modalPanel:nth-child(4)',
      content: 'Spara respektive öppna till och från en fil på hårddisken.',
    },
    
    {
      target: 'div.modalPanel:nth-child(5)',
      content: 'Varje dag i kalendern har en siffran i övre vänstra hörnet'
	     + ' som visar antalet schemalagda timmar den dagen. Om siffran'
	     + ' uppfyller regeln så kommer den att få den angivna färgen.'
	     + ' Lägg till en regel och gör en förändring för att fortsätta.',
      hideFooter: true,
      spotlightClicks: true,
    },

    {
      target: '#closeBubble',
      content: 'Stäng menyn genom att klicka här eller genom att trycka på esc.',
      placement: 'top-start',
      hideCloseButton: true,
      hideFooter: true,
      spotlightClicks: true,
    },

    {
      target: '#sideContainer',
      content: 'Passet och resursen som lades till tidigare finns nu'
	     + ' i listan. Den grå bakgrunden betyder att passet eller resursen'
	     + ' är markerat och kommer att användas då en händelse läggs till.',
      placement: 'left',
      hideBackButton: true,
    },

    {
      target: 'div.rbc-month-row:nth-child(4) > div:nth-child(1) > div:nth-child(4)',
      content: 'Klicka på en kalenderruta för att lägga till en händelse. Du'
	     + ' kan också klicka och dra för att lägga till flera samtidigt.',
      placement: 'left',
      spotlightClicks: true,
      disableOverlay: true,
    },

    {
      target: 'span.rbc-btn-group:nth-child(3) > button:nth-child(1)',
      content: 'Schemaläggaren är nu i månadsvyn. I den här vyn kan bara normala'
	     + ' händelser läggas till och de kommer att döpas efter resursens och passets'
	     + ' namn. Hur länge händelsen varar och när den börjar bestäms av det'
	     + ' markerade passet. Om passet eller resursen ändras - färg eller namn t.ex.'
	     + ' - så kommer alla schemalagda händelser också att förändras.',
      placement: 'bottom',
    },

    {
      target: 'span.rbc-btn-group:nth-child(3) > button:nth-child(2)',
      content: 'Klicka här för att ändra till veckovyn.',
      placement: 'bottom',
      hideCloseButton: true,
      hideFooter: true,
      spotlightClicks: true,
    },

    {
      target: 'body',
      placement: 'center',
      content: 'Notera hur sidopanelen inte syns längre. I veckovyn så används'
	     + ' inte pass eller resurser utan fristående händelser skapas i stället.'
	     + ' De är inte kopplade till något och kommer inte att ändras om något'
	     + ' av passen eller resurserna förändras.',
      disableOverlay: true,
    },

    {
      target: 'div.rbc-day-slot:nth-child(4) > div:nth-child(13)',
      content: 'Klicka och dra för att lägga till en händelse.',
      hideCloseButton: true,
      hideFooter: true,
      spotlightClicks: true,
      hideCloseButton: true,
    },

    {
      target: '.ReactModal__Content',
      content: 'Den här menyn fungerar precis som den tidigare meny så klicka'
	     + ' på det du vill ändra. Schemaläggaren kommer att säga till om du'
	     + ' försöker göra något galet så inget kan gå fel.',
      placement: 'left',
      offset: 100,
      hideCloseButton: true,
      hideFooter: true,
      spotlightClicks: true,
      disableOverlay: true,
    },

    {
      target: 'body',
      title: 'Ändra utlagda händelser',
      content: (
	<p
	style = {{
	  textAlign: 'left',
	}}>
	  <b>Högerklick</b> - tar bort händelsen<br />
	  <b>Dubbelklick</b> - redigerar händelsen<br />
	  Klicka och dra för att flytta en händelse
	</p>
      ),
      placement: 'center',
      hideBackButton: true,
    },

    {
      target: 'body',
      content: 'Du är nu klar med genomgången. Lycka till! 🎂',
      placement: 'center',
      hideBackButton: true,
    }

  ]

  handleCallback = arg => {
    if (arg.type === 'tour:end') {
      this.props.done()
      return
    }
      
    if (arg.type === 'step:after')
      this.props.setStep(arg.index+1)

    if (arg.action === 'skip')
      this.props.done()

    if (arg.action === 'prev'
	&& arg.type === 'step:after') {
      console.log('prev arg: ', arg)
      this.props.setStep(arg.index-1)
    }
    
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
	  back: 'Tillbaka',
	}}
	callback = { this.handleCallback }
	disableBeacon = { true }
	continuous = { true }
	run = { this.props.run }
      />
    )
  }
}

export default PackageTour
