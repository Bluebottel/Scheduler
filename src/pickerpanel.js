import React, { Component } from 'react'
import update from 'immutability-helper'
import moment from 'moment'

function timePad(number)
{ return (number < 10) ? "0" + number : number }


class PickerPanel extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div id = "sideContainer">
	<div className = "boxLabel">Pass</div>
	<div className = "pickerBox">
	  {
	    this.props.shifts.map((shift, i) => {
	      return (
		<div
		  className =
		  {`option${shift.id === this.props.selected.shift.id ? ' selected' : ''}`}
		  onClick = {() => {
		      
		      this.setState({
			selected: update(this.props.selected, { shift: {$set: shift}})
		      })
		      
		      this.props.setSelected({
			shift: shift,
			resource: this.props.selected.resource
		      })
		  }}
		  key = { i } >
		  <div className = "shiftTitle">{ shift.title }</div>
		  <ShiftInfoBlock className = "shiftInfo" shift = { shift } />
		</div>
	      )
	      
	  })
	  }
      </div>
      
      <div className = "boxLabel">Personer</div>
      <div className = "pickerBox">
      {
	this.props.resources.map((res, i) => {
	  return (
	    <div
	    className =
	      {`option${res.id === this.props.selected.resource.id ? ' selected' : ''}`}
	    
	    onClick = {() => {
	      this.setState({
		selected: update(this.props.selected, { resource: {$set: res}})
	      })

	      this.props.setSelected({
		shift: this.props.selected.shift,
		resource: res,
	      })
	    }}
	    key = { i } >
	    { res.title }
      </div>
	  )
	}) 
      }
      </div>
      <button onClick = { () => this.props.setOptionsModal(true) }>
	Options
      </button>
      
      </div>
    )
  }
}

function ShiftInfoBlock(props) {

  let stop = new Date()
  stop.setHours(props.shift.startHour, props.shift.startMinute, 0)
  stop = moment(stop).add(props.shift.minuteLength, 'm').toDate()
  const fromTo = timePad(props.shift.startHour) + ':' + 
		 timePad(props.shift.startMinute) + ' - ' +
		 timePad(stop.getHours()) + ':' +
		 timePad(stop.getMinutes())
  
  return (
    <div className = { props.className }>
      { fromTo }
    </div>
  )
}


export default PickerPanel
