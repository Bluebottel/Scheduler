import React, { Component } from 'react'
import update from 'immutability-helper'
import EditableLabel from 'react-inline-editing'

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

    this.updateTitle = this.updateTitle.bind(this)
  }

  updateTitle(newElement, target) {
    
  }

  //TODO: add onClicks for the images (edit, delete)
  // TODO: fix classname on wrapping div in editlabel
  render() {
    return (
      <div style = {{ display: "flex" }}>
	<div className = "modalPanel">
	  <div className = "boxLabel">Resurser</div>
	  <div className = "pickerBox">
	    {
	      this.state.resources.map((res, i) => {
		return (
		  <div className = "option" key = { i }>
		      <EditableLabel
			text = { res.resourceTitleAccessor  }
			onFocusOut = { (text) => console.log(`out with ${text}`) }
			labelClassName = { 'optionMainPanel' }
			inputClassName = { 'optionMainPanel' }
		      />
		    <div className = "optionSidePanel">
		      <img
			src = { edit }
			alt = "[Edit]"
		      />
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
		    <div className = "optionMainPanel">
		      { shift.title }
		    </div>
		    <div className = "optionSidePanel">
		      <img
			src = { edit }
			alt = "[Edit]"
		      />
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
