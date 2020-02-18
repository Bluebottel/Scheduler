import React, { Component } from 'react'

import ColorPicker from 'rc-color-picker'
import 'rc-color-picker/assets/index.css'

import InputMoment from 'input-moment'
import 'input-moment/dist/input-moment.css'

import moment from 'moment'

import './customeventmodal.css'

function timePad(number)
{ return (number < 10) ? "0" + number : number }

class CustomEventModal extends Component {
  constructor(props) {
    super(props)

    this.state = {
      eventColor: this.randomColor(),
      start: this.props.event.start,
      end: this.props.event.end,
      customTitle: '',
      choosingStart: false,
      choosingEnd: false,
    }
    
  }

  componentDidMount() {
    this.titleInput.focus()
  }

  randomColor = () => { return "#"+((1<<24)*Math
    .random()|0).toString(16) }

  // date = "start" | "end"
  dateTimePicker = ({ trigger, date, changeTarget, saveTo }) => {

    let dt = this.state[date]
    
    if (!trigger)
      return (
	  <div
	    className = 'clickable'
	    style = {{
	      display: 'inline-table',
	      padding: '0px 4px 0px 4px',
	      border: '1px solid #a8a8a8',
	    }}
	    onClick = { () => {
		this.setState({
		  choosingStart: true,
		})
	    }}
	  >
	    {
	      dt.getFullYear() + '-' +
	      timePad(dt.getMonth()) +  '-' +
	      timePad(dt.getDay()) + ' ' +
	      timePad(dt.getHours()) + ':' +
	      timePad(dt.getMinutes())
	    }
	  </div>
      )

    else return (
      <InputMoment
	moment = { moment(moment(this.state[date])) }
	onSave = { arg => {

	    console.log('arg: ', arg)

	}}
	minStep = { 1 }
	hourStep = { 1 }
	prevMonthIcon = "ion-ios-arrow-left"
	nextMonthIcon = "ion-ios-arrow-right"
      />
    )
  }

  optionsTable = () => {

    return (
      <React.Fragment>
	<div
	  style = {{
	    display: 'flex',
	    alignItems: 'center',
	  }}>
	  <div
	    style = {{
	      marginRight: '10px',
	    }}
	  >
	    Färg
	  </div>
	  <ColorPicker
	    enableAlpha = { false }
	    animation = 'slide-up'
	    color = { this.state.eventColor }
	    onClose = { choice => {
		this.setState({
		  eventColor: choice.color
		})
	    }}
	  />
	</div>

	<div>
	  <div style = {{
	    display: 'inline',
	    marginRight: '10px',
	  }}
	  >
	    Börjar
	  </div>
	  {
	    this.dateTimePicker({
	      trigger: this.state.choosingStart,
	      date: 'start',
	      changeTarget: 'start',
	      saveTo: 'start',
	    })
	  }
	</div>

	<div>
	  <div>Slutar</div>
	  <div>timepicker</div>
	</div>
      </React.Fragment>
    )
  }

  render() {
    return (
      <React.Fragment>
	<div style = {{
	  textAlign: "center",
	  fontWeight: "bold",
	  margin: '-8px 0px 6px 0px',
	}}
	>
	  Ny händelse
	</div>
	<div
	  style = {{
	    marginRight: '10px',
	  }}
	>
	  <input
	    ref = { instance => this.titleInput = instance }
	    type = "text"
	    placeholder = "Titel"
	    onChange = { event => this.setState({
		customTitle: event.target.value,
	    })}
	    style = {{
	      border: '1px solid #a8a8a8',
	      padding: '4px',
	      width: '100%',
	    }}
	  >
	  </input>
	</div>

	{ this.optionsTable() }
	
	<div
	  style = {{
	    display: "flex",
	    justifyContent: "space-between",
	    marginBottom: '-3px',
	  }}>
	  <button
	    onClick = { () => {
		this.props.addEvent({
		  customTitle: this.state.customTitle,
		  start: this.state.start,
		  end: this.state.end,
		  color: this.state.eventColor,
		})
		this.props.closeModal()
	    }}
	    style = {{
	      borderRadius: '0px 0px 0px 5px',
	    }}
	  >
	    Spara
	  </button>
	  <button
	    onClick = { this.props.closeModal }
	    style = {{
	      borderRadius: '0px 0px 5px 0px',
	    }}
	  >
	    Avbryt
	  </button>
	</div>
      </React.Fragment>
    )
  }
}

export default CustomEventModal
