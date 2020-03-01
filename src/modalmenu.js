import React, { Component } from 'react'
import update from 'immutability-helper'

import EasyEdit from 'react-easy-edit'
import InlineConfirmButton from 'react-inline-confirm'

import ColorPicker from 'rc-color-picker'
import 'rc-color-picker/assets/index.css'

import TimePicker from 'react-times'
import 'react-times/css/material/default.css'

import { timePad } from './utilities'

import trashcan from './img/trashcan.png'
import addBubble from './img/plus.png'

import './modalmenu.css'

import SavePanel from './savepanel'

class ModalMenu extends Component {
  constructor(props) {
    super(props)

    this.state = {
      picked : {
	hour: 0,
	minute: 0,
      },
      timePickerOpen: false,
      shifts: this.props.shifts,
      time: {
	hour: 21,
	minute: 5,
      }
    }

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
	    this.props.create({
	      title: 'Person',
	      color: this.randomColor(),
	    }, 'resources')
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
	      <TimePicker
		time = { shift.startHour + ':' + shift.startMinute }
		onFocusChange = { focus => {
		  // this only triggers when the picker closes for some reason
		    this.setState({
		      timePickerOpen: false,
		    })
		}}
	      
		onTimeChange = { ({hour, minute}) => {
		    const replacement = update(shift, {
		      startHour: {$set: hour},
		      startMinute: {$set: minute}
		    })

		    this.props.updateElement(replacement, 'shifts')
		}}
	      
		withoutIcon
		focused = { this.state.timePickerOpen === shift.id }
		trigger = {(
		    <div
		    onClick = { e => {
			this.setState({
			  timePickerOpen: shift.id,
			})
		    }}
			      className = "clickable"
		      >
		      {
			`${timePad(shift.startHour)}:`
			+ `${timePad(shift.startMinute)}`
		      }
		    </div>
		)}
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
	  <div className = "boxLabel">Lagring</div>
	  <div className = "pickerBox">
	    <SavePanel
	      insert = { newData => this.props.insert(newData) }
	      closeModal = { this.props.closeModal }
	    />
	  </div>
	</div>
	
	
      </div>
    )
  }

}

export default ModalMenu
