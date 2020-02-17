import React, { Component } from 'react'

import EasyEdit from 'react-easy-edit'
import TimePicker from 'react-time-picker'
import InlineConfirmButton from 'react-inline-confirm'

import ColorPicker from 'rc-color-picker'
import 'rc-color-picker/assets/index.css'

import trashcan from './img/trashcan.png'
import edit from './img/edit.png'
import addBubble from './img/plus.png'

import './modalmenu.css'

import FTPPanel from './ftp'


function timePad(number)
{ return (number < 10) ? "0" + number : number }

class ModalMenu extends Component {
  constructor(props) {
    super(props)

    this.state = {
      picked : {
	hour: 0,
	minute: 0,
      },
    }

    this.clock = clock.bind(this)
  }

  randomColor = () => { return "#"+((1<<24)*Math.random()|0).toString(16) }

  // TODO: remove the focus outline from the inline confirm button
  renderResources = () => {
    let optionsList = (
      this.props.resources.map((resource, i) => {
	return (
	  <div className = "option" key = { i }>
	    <EasyEdit
	      type = "text"
	      value = { resource.title  }
	      onSave = {
		text => {
		  resource.title = text
		  this.props.updateElement(resource, 'resources')
		}}
	      onValidate = { text => text.length > 0 }
	      validationMessage = "Namnet kan inte vara tomt"

	      saveButtonLabel = "Spara"
	      cancelButtonLabel = "Avbryt"
	      onHoverCssClass = "clickable"
	    />
	    <div className = "optionSidePanel">
	      <div style={{ display: "inline-table" }}>
		<ColorPicker
		  animation = "slide-up"
		  color = { resource.color }
		  onClose = { color => {
		      resource.color = color.color
		      this.props.updateElement(resource, 'resources')
		  }}
		  enableAlpha = { false }
		/>
	      </div>

	      <InlineConfirmButton
		className = "confirmButton"
		textValues = {['', 'Ta bort?', '']}
		onClick = { () => this.props.archive(resource, 'resources') }
		showTimer
		isExecuting = { false }
	      >
		<img
		  src = { trashcan }
		  alt = "[Delete]"
		  className = "clickable"
		/>
	      </InlineConfirmButton>
	    </div>
	  </div>
	)
      })
    )

    const addResourceRow = (
      <div
	style = {{
	  textAlign: 'center',
	  marginTop: '5px',
	}}
	onClick = { () => {
	let created = this.props.create(
	    {
	      title: 'Person',
	      color: this.randomColor(),
	    }, 'resources')
	    // TODO: set this one as selected!
	}}
	className = "clickable"
	key = { optionsList.length }
      >
	<img
	  src = { addBubble }
	  alt = "Lägg till"
	  style = {{ height: '20px' }}
	/>
      </div>
    )

    optionsList.push(addResourceRow)
    return optionsList
  }

  renderShifts = () => {
    let shiftOptions = (
      this.props.shifts.map((shift, i) => {
	return (
	  <tr key = { i }>
	    <td>
	      <EasyEdit
		type = "text"
		value = { shift.title }
		onSave = {
		  text => {
		    if (text.length === 0)
		      return
		    
		    shift.title = text
		    this.props.updateElement(shift, 'shifts')
		  }
		}

		onValidate = { text => text.length > 0 }
		validationMessage = "Namnet kan inte vara tomt"
	      
		saveButtonLabel = "Spara"
		cancelButtonLabel = "Avbryt"
		onHoverCssClass = "clickable"
	      />
	    </td>

	    <td>
	      <EasyEdit
		type = "text"
		value = { timePad(shift.startHour) + ':'
		       + timePad(shift.startMinute) }
		onSave = {
		  text => {
		    shift.startHour = parseInt(this.state.picked.split(':')[0])
		    shift.startMinute = parseInt(this.state.picked.split(':')[1])
		    this.props.updateElement(shift, 'shifts')
		  }}

		editComponent = { this.clock(shift) }

		saveButtonLabel = "Spara"
		cancelButtonLabel = "Avbryt"
		onHoverCssClass = "clickable"
	      />
	    </td>
	    
	    <td>
	      <EasyEdit
		type = "number"

		value = {
		  // the component throws an error unless
		  // supplied with a string
		  shift.minuteLength.toString()
		}

	      onSave = {
		value => {
		  shift.minuteLength = value
		  this.props.updateElement(shift, 'shifts')
		}}
	      
		onValidate = { value => value > 0 }
		validationMessage = "Måste vara en siffra > 0"

		saveButtonLabel = "Spara"
		cancelButtonLabel = "Avbryt"
		onHoverCssClass = "clickable"
	      />
	    </td>

	    <td>
	      <div className = "optionSidePanel">
		<InlineConfirmButton
		  className = "confirmButton"
		  textValues = {['', 'Ta bort?', '']}
		  onClick = { () => this.props.archive(shift, 'shifts') }
		  showTimer
		  isExecuting = { false }
		>
		  <img
		    src = { trashcan }
		    alt = "[Delete]"
		    className = "clickable"
		  />
		  
		</InlineConfirmButton>
	      </div>
	    </td>
	  </tr>
	)
      })
    )

    return (
      <React.Fragment>
	{ shiftOptions }
      </React.Fragment>
    )
  }

  addShiftRow = () => {
    return (
      <div
	style = {{
	  textAlign: 'center',
	  marginTop: '5px',
	}}
	onClick = { () => this.props.create(
	    {
	      title: 'Pass',
	      startHour: 13,
	      startMinute: 37,
	      minuteLength: 420,
	    }, 'shifts')
	}
	className = "clickable"
      >
	<img
	  src = { addBubble }
	  alt = "Lägg till"
	  style = {{ height: '20px' }}
	/>
      </div>
    )
  }

  // TODO: make a 75% border around the close bubble
  render() {   
    return (
      <div style = {{ display: "flex" }}>
	<div id ="closeBubble" onClick = { this.props.closeModal }>
	  <div className = "__arc">
	    X
	  </div>
	</div>
	<div className = "modalPanel">
	  <div className = "boxLabel">Resurser</div>
	  <div className = "pickerBox">
	    { this.renderResources() }
	  </div>
	</div>

	<div className = "modalPanel">
	  <div className = "boxLabel">Pass</div>
	  <div className = "pickerBox">
	    <table className = "panelTable">
	      <thead>
		<tr>
		  <th style = {{textAlign: "left" }}>Namn</th>
		  <th style = {{textAlign: "center" }} >Start</th>
		  <th>Längd (min)</th>
		  <th></th>
		</tr>
	      </thead>
	      <tbody>
		{ this.renderShifts() }
	      </tbody>
	    </table>
	    { this.addShiftRow() }

	  </div>
	</div>

	<div className = "modalPanel">
	  <div className = "boxLabel">FTP</div>
	  <div className = "pickerBox">
	    <FTPPanel />
	  </div>
	</div>
	
      </div>
    )
  }

}

function clock({ startHour, startMinute }) {

  return (
    <React.Fragment>
      <TimePicker
      maxDetail = "minute"
      isOpen = { true }
      hourPlaceholder = { timePad(startHour).toString() }
      minutePlaceholder = { timePad(startMinute).toString() }
      locale = "sv-SE"
      value = { `${timePad(startHour)}:${timePad(startMinute)}:00` }
      onChange = { value => this.setState({ picked: value}) }
      autoFocus
      />
    </React.Fragment>
  )
}

export default ModalMenu
