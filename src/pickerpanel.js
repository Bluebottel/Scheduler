import React, { Component } from 'react'
import update from 'immutability-helper'

function timePad(number)
{ return (number < 10) ? "0" + number : number }


class PickerPanel extends Component {
  constructor(props) {
    super(props)

    this.state = {
      shifts: this.props.shifts,
      resources: this.props.resources,
      selected: {
	shift: -1,
	resource: -1,
      }
    }
  }

  render() {
    return (
      <div id="sideContainer">
	<div className="boxLabel">Pass</div>
	<div className="pickerBox">
	  {
	    this.state.shifts.map((shift, i) => {
	      return (
		<div
		  className =
		  {`option${i === this.state.selected.shift ? ' selected' : ''}`}
		  onClick = {() =>
		    this.setState(update(this.state,
					 {selected: { shift: {$set: i }}}))}
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
		  {`option${i === this.state.selected.resource ? ' selected' : ''}`}
		  onClick = { () =>
		    this.setState(update(this.state,
					 { selected: { resource: {$set: i }}}))
		  }
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
