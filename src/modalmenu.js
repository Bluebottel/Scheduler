import React, { Component } from 'react'
import update from 'immutability-helper'
import EasyEdit from 'react-easy-edit'
import TimePicker from 'react-time-picker'

import ColorPicker from 'rc-color-picker'
import 'rc-color-picker/assets/index.css'

import trashcan from './img/trashcan.png'
import edit from './img/edit.png'

import './modalmenu.css'

import FTPPanel from './ftp'

function timePad(number)
{ return (number < 10) ? "0" + number : number }

class ModalMenu extends Component {
  constructor(props) {
    super(props)

    this.state = {
      events: this.props.events,
      resources: this.props.resources,
      shifts: this.props.shifts,
      picked : {
	hour: 0,
	minute: 0,
      },
    }
  }

  //TODO: add onClicks for the images (delete)
  render() {   
    return (
      <div style = {{ display: "flex" }}>
	<div id ="closeBubble">
	  <div className = "arc">
	  </div>
	</div>
	<div className = "modalPanel">
	  <div className = "boxLabel">Resurser</div>
	  <div className = "pickerBox">
	    {
	      this.state.resources.map((resource, i) => {
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
		      />
		    </div>
		  </div>
		)
	      })

	    }
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
		{
		  this.state.shifts.map((shift, i) => {
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
		}
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
	hourPlaceholder = { timePad(startHour) }
	minutePlaceholder = { timePad(startMinute) }
	locale = "sv-SE"
	value = { `${timePad(startHour)}:${timePad(startMinute)}:00` }
	onChange = { value => changeCallback(value) }
	autoFocus
      />
    </React.Fragment>
  )
}

export default ModalMenu
