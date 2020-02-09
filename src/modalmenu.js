import React, { Component } from 'react'
import update from 'immutability-helper'
import EditableLabel from 'react-inline-editing'

import ColorPicker from 'rc-color-picker'
import 'rc-color-picker/assets/index.css'

import trashcan from './img/trashcan.png'
import edit from './img/edit.png'

import './modalmenu.css'

import FTPPanel from './ftp'

class ModalMenu extends Component {
  constructor(props) {
    super(props)

    this.state = {
      events: this.props.events,
      resources: this.props.resources,
      shifts: this.props.shifts,
    }
  }

  //TODO: add onClicks for the images (edit, delete)
  // TODO: use https://www.npmjs.com/package/react-editable-label instead
  render() {
    return (
      <div style = {{ display: "flex" }}>
	<div className = "modalPanel">
	  <div className = "boxLabel">Resurser</div>
	  <div className = "pickerBox">
	    {
	      this.state.resources.map((resource, i) => {
		return (
		  <div className = "option" key = { i }>
		    <EditableLabel
		      text = { resource.title  }
		      onFocusOut = {
			text => {
			  if (text.length === 0)
			    return
			  
			  resource.title = text
			  this.props.updateElement(resource, 'resources')
			}}
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
	    {
	      this.state.shifts.map((shift, i) => {
		return (
		  <div className = "option" key = { i }>
		    <EditableLabel
		      text = { shift.title }
		      onFocusOut = {
			text => {
			  if (text.length === 0)
			    return
			  
			  shift.title = text
			  this.props.updateElement(shift, 'shifts')
			}}
		    />
		    <EditableLabel
		      text = { `${shift.startHour}:${shift.startMinute}`}
		      onFocusOut = {
			text => {
			  if (text.length === 0)
			    return
			  
			  console.log('new text: ', text)
			}}
		    />
		    <div className = "optionSidePanel">
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
	  <div className = "boxLabel">FTP</div>
	  <div className = "pickerBox">
	    <FTPPanel />
	  </div>
	</div>
	
      </div>
    )
  }
}

export default ModalMenu
