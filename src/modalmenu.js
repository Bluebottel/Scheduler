import React, { Component } from 'react'
import update from 'immutability-helper'
import EasyEdit from 'react-easy-edit'
import TimePicker from 'react-time-picker'

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
  }

  randomColor = () => { return "#"+((1<<24)*Math.random()|0).toString(16) }


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
	      <img
		src = { trashcan }
		alt = "[Delete]"
		onClick = { () => this.props.archiveResource(resource) }
		className = "clickable"
	      />
	    </div>
	  </div>
	)
      })
    )

    // TODO: make this a plus sign image instead
    const addResourceRow = (
      <div
	style = {{ textAlign: 'center' }}
	onClick = { () => this.props.createResource('RiktigPerson', this.randomColor()) }
	className = "clickable"
	key = { optionsList.length }
      >
	<img
	  src = { addBubble }
	  alt = "Lägg till"
	  style = {{ height: '25px' }}
	/>
      </div>
    )

    optionsList.push(addResourceRow)
    return optionsList
  }

  renderShifts = () => {

    return (
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
		    shift.startHour = parseInt(this.state.picked.hour)
		    shift.startMinute = parseInt(this.state.picked.minute)
		    this.props.updateElement(shift, 'shifts')
		  }}

		editComponent = {
		  clock(shift,
			value => {
			  this.setState({
			    picked: {
			      hour: value.split(':')[0],
			      minute: value.split(':')[1],
			    }
			  })
			})
		}

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
		<img
		  src = { trashcan }
		  alt = "[Delete]"
		/>
	      </div>
	    </td>
	  </tr>
	)
      })
    )
    
  }

  // TODO: add onClicks for the images (delete)
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

function clock({ startHour, startMinute }, changeCallback) {

  return (
    <React.Fragment>
      <TimePicker
      maxDetail = "minute"
      isOpen = { true }
      hourPlaceholder = { timePad(startHour).toString() }
      minutePlaceholder = { timePad(startMinute).toString() }
      locale = "sv-SE"
      value = { `${timePad(startHour)}:${timePad(startMinute)}:00` }
      onChange = { value => changeCallback(value) }
      autoFocus
      />
    </React.Fragment>
  )
}

export default ModalMenu
