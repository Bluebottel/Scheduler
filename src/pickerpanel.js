import React, { Component } from 'react'
import update from 'immutability-helper'

function timePad(number)
{ return (number < 10) ? "0" + number : number }


class PickerPanel extends Component {
  constructor(props) {
    super(props)

    console.log('prop selected: ', this.props.selected)

    this.state = {
      shifts: this.props.shifts,
      resources: this.props.resources,
      selected: this.props.selected,
    }
  }

  render() {
    return (
      <div id = "sideContainer">
	<div className = "boxLabel">Pass</div>
	<div className = "pickerBox">
	  {
	    this.state.shifts.map((shift, i) => {
	      return (
		<div
		  className =
		  {`option${shift.id === this.state.selected.shift.id ? ' selected' : ''}`}
		  onClick = {() => {
		      
		      this.setState({
			selected: update(this.state.selected, { shift: {$set: shift}})
		      })
		      
		      this.props.setSelected({
			shift: shift,
			resource: this.state.selected.resource
		      })
		  }}
		  key = { i } >
		  <div className = "shiftTitle">{ shift.title }</div>
		  <div className = "shiftInfo">
		    {
		      `${timePad(shift.startHour)}` + 
		      `:${timePad(shift.startMinute)} - `
		    }
		  </div>
		</div>
	      )
	      
	    })
	  }
      </div>
      
      <div className = "boxLabel">Personer</div>
      <div className = "pickerBox">
      {
	this.state.resources.map((res, i) => {
	  return (
	    <div
	    className =
	      {`option${res.id === this.state.selected.resource.id ? ' selected' : ''}`}
	    
	    onClick = {() => {
	      this.setState({
		selected: update(this.state.selected, { resource: {$set: res}})
	      })

	      this.props.setSelected({
		shift: this.state.selected.shift,
		resource: res,
	      })
	    }}
	    key = { i } >
	    { res.resourceTitleAccessor }
      </div>
	  )
	}) 
      }
      </div>
      </div>
    )
  }
}

export default PickerPanel
