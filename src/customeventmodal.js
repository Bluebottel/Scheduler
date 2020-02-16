import React, { Component } from 'react'

import TimePicker from 'react-time-picker'
import ColorPicker from 'rc-color-picker'
import 'rc-color-picker/assets/index.css'

import './customeventmodal.css'

class CustomEventModal extends Component {
  constructor(props) {
    super(props)

    this.state = {
      eventColor: this.props.event.color,
      start: this.props.event.start,
      end: this.props.event.end,
    }
    
  }

  componentDidMount() {
    this.titleInput.focus()
  }

  randomColor = () => { return "#"+((1<<24)*Math
    .random()|0).toString(16) }

  render() {
    return (
      <React.Fragment>
	<div style = {{
	  textAlign: "center",
	  fontWeight: "bold",
	}}
	>
	  Ny händelse
	</div>
	
	<input
	  ref = { instance => this.titleInput = instance }
	  type = "text"
	  placeholder = "Titel">
	</input>

	<div>
	  <div>Färg</div>
	  <ColorPicker
	    enableAlpha = { false }
	    animation = "slide-up"
	    color = { this.state.eventColor }
	    onClose = { choice => {
		this.setState({
		  eventColor: choice.color
		})
	    }}
	  />
	</div>

	<div
	  style = {{
	    display: "flex",
	    justifyContent: "space-between"
	  }}>
	  <button
	    onClick = { () => {
		// save stuff
		this.props.closeModal()
	    }}>
	    Spara
	  </button>
	  <button onClick = { this.props.closeModal }>
	    Avbryt
	  </button>
	</div>
      </React.Fragment>
    )
  }
}

export default CustomEventModal
