import React, { Component } from 'react'
import update from 'immutability-helper'

import EasyEdit from 'react-easy-edit'
import InlineConfirmButton from 'react-inline-confirm'

import ColorPicker from 'rc-color-picker'
import 'rc-color-picker/assets/index.css'

import TimePicker from 'react-times'
import 'react-times/css/material/default.css'

import { timePad } from './utilities'
import { updateCondition } from './rulestore'

import trashcan from './img/trashcan.png'
import addBubble from './img/plus.png'

import './modalmenu.css'

import SavePanel from './savepanel'
import RulesPanel from './rulespanel'
import packageJson from '../package.json'

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
	  <React.Fragment>
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
		style = {{ height: '17px' }}
	      />
	      
	    </InlineConfirmButton>
	  </React.Fragment>
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
	  marginTop: '0.5vh',
	  gridColumn: '1 / span 4',
	}}
	onClick = { () => this.props.create(
	    {
	      title: 'Pass',
	      startHour: 8,
	      startMinute: 0,
	      minuteLength: 480,
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
  
  addRuleRow = () => {
    return (
      <div
	style = {{
	  textAlign: 'center',
	  marginTop: '5px',
	}}
	onClick = { arg => {
	    let newRules = this.props.rules
	    newRules.push({
	      text: '=',
	      value: '8.0',
	      color: this.randomColor(),
	    })
	    newRules[newRules.length-1] = updateCondition(newRules[newRules.length-1])
	    this.props.setRules(newRules)
	}}
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

  // TODO: make the shift column highlight on mouse over
  render() {   
    return (
      <div style = {{
	display: 'flex',
	flexWrap: 'wrap',
      }}>
	<div id ="closeBubble" onClick = { this.props.closeModal }>
	  <div className = 'bubbleCenter'>
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

	    <div
	      style = {{
		display: 'grid',
		gridTemplateColumn: 'max-content min-content min-content 20px',
		gridColumnGap: '0.5vw',
	      }}
	    >

	      <div
		style = {{textAlign: "left" }}
		className = 'shiftColumnHeader'
	      >
		Namn
	      </div>
	      
	      <div
		style = {{textAlign: "center" }}
		className = 'shiftColumnHeader'
	      >
		Start
	      </div>
	      <div className = 'shiftColumnHeader'>Längd</div>
	      <div></div>

	      { this.renderShifts() }
	      { this.addShiftRow() }
	    </div>
	    
	  </div>
	</div>

	<div className = "modalPanel">
	  <div className = "boxLabel">Lagring</div>
	  <div className = "pickerBox">
	    <SavePanel
	      insert = { newData => this.props.insert(newData) }
	      closeModal = { this.props.closeModal }
	      setLoadingError = { (message, error) => {
		  this.setState({
		    loadingError: {
		      message: message,
		      error: error,
		    }
		  })
	      }}
	      loadingError = { this.state.loadingError }
	    />
	  </div>
	</div>

	<div className = "modalPanel">
	  <div className = "boxLabel">Regler</div>
	  <div className = "pickerBox">
	    <RulesPanel
	      rules = { this.props.rules }
	      setRules = { newRules => {
		  this.props.advanceTutorial()
		  this.props.setRules(newRules)
	      }}
	    />
	    { this.addRuleRow() }
	  </div>
	</div>

	<div
	  style = {{
	    position: 'absolute',
	    bottom: '3px',
	    right: '3px',
	    background: 'none',
	    padding: '0px 3px 0px 3px',
	    color: '#c3bebe',
	  }}
	>
	  { packageJson.version }
	</div>
      </div>
    )
  }

}

export default ModalMenu
