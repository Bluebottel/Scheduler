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
      startChoosing: false,
      endChoosing: false,
    }
    
  }

  componentDidMount() {
    this.titleInput.focus()
  }

  randomColor = () => { return "#"+((1<<24)*Math
    .random()|0).toString(16) }

  generalErrorPanel = () => {
    if (!this.state.generalError)
      return ''

    else return (
      <div
	style = {{
	  textAlign: 'center',
	  margin: '-8px 0px 6px',
	  background: '#ffa5a5',
	}}
      >
	{ this.state.generalError }
      </div>
    )
  }

  // target = "start" | "end"
  dateTimePicker = ({ trigger, target }) => {

    let dt = this.state[target]

    if (!trigger)
      return (
	  <div
	    className = 'clickable'
	    style = {{
	      display: 'inline-table',
	      padding: '0px 4px 0px 4px',
	    }}
	    onClick = { () => {
		this.setState({
		  [`${target}Choosing`]: true,
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
	mindate = { new Date() }
	moment = { moment(this.state[target]) }
	onSave = { () => {
	    this.setState({
	      [`${target}Choosing`]: false,
	    })	    
	}}
	onChange = { newMoment => {
	    if (target === 'start' && newMoment.isAfter(this.state.end)) {
	      this.setState({
		dateError: 'Händelsen måste börja innan den slutar',
	      })
	      return
	    }

	      if (target === 'end' && newMoment.isBefore(this.state.start) ) {
		this.setState({
		  dateError: 'Händelsen måste sluta innan den börjar',
		})
		return
	      }

	      this.setState({
		[target]: newMoment.toDate(),
		dateError: undefined,
	      })  
	}}
	minStep = { 15 }
	hourStep = { 1 }
	prevMonthIcon = "ion-ios-arrow-left"
	nextMonthIcon = "ion-ios-arrow-right"
      />
	    )
  }

  optionsTable = () => {

    if (this.state.startChoosing || this.state.endChoosing) {
      const target = this.state.startChoosing ? 'start' : 'end'
      let errorPanel
      
      if (this.state.dateError)
	errorPanel = (
	  <div
	    className = 'errorPanel'
	    style = {{
	      width: '100%',
	      textAlign: 'center',
	    }} 
	  >
	    { this.state.dateError }
	  </div>
	)
      else errorPanel = ''
      
      return (
	<React.Fragment>
	  <div
	    style = {{
	      width: '100%',
	      textAlign: 'center',
	  }}>
	    <b>{ target === 'start' ? 'Börjar' : 'Slutar' }</b>
	  </div>
	  
	  { this.generalErrorPanel() }
	  
	  {
	    this.dateTimePicker({
	      trigger: true,
	      target: target,
	    })
	  }
	</React.Fragment>
      )
    }
    
    return (
      <table>
	<tbody>
	  
	  <tr>
	    <td
	      style = {{
		width: '50px',
	      }}
	    >
	      Färg
	    </td>
	    <td>
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
	    </td>
	  </tr>

	  <tr>
	    <td>Börjar</td>
	    <td>
	      {
		this.dateTimePicker({
		  trigger: this.state.startChoosing,
		  target: 'start'
		})
	      }
	    </td>
	  </tr>

	  <tr>
	    <td>Slutar</td>
	    <td>
	      {
		this.dateTimePicker({
		  trigger: this.state.endChoosing,
		  target: 'end'
		})
	      }
	    </td>
	  </tr>
	</tbody>
      </table>
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
	    onChange = { event => {
		let newError = undefined
		if (event.target.value.length === 0)
		  newError = this.state.generalError

		this.setState({
		  customTitle: event.target.value,
		  generalError: newError,
		})
	    }}
	    style = {{
	      padding: '4px',
	      width: '100%',
	    }}
	  >
	  </input>
	</div>

	{ this.generalErrorPanel() }

	{ this.optionsTable() }
	
	<div
	  style = {{
	    display: "flex",
	    justifyContent: "space-between",
	    marginBottom: '-3px',
	  }}>
	  <button
	    onClick = { () => {
		if (!this.state.customTitle || this.state.customTitle.length === 0) {

		  this.setState({
		    generalError: 'Titeln får inte vara tom',
		  })
		  return
		}
		
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
