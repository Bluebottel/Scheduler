import React from 'react'
import moment from 'moment'
import update from 'immutability-helper'
import { storeShifts, storeMetaData } from './storage'


// TODO: remove this and rewrite the resource functions to be
// type agnostic instead since they are identical
function createShift (title, startHour, startMinute, minuteLength) {

  // make sure that the new ID is unique by making it larger than every other ID
  // including removed shifts since those can still have events tied to them
  let newId = 0
  this.state.shifts.forEach(sh => { if (sh.id >= newId) { newId = sh.id }})
  this.state.meta.archive.shifts
    .forEach(sh => { if (sh.id >= newId) { newId = sh.id }})
  newId++;
  
  const newShift = {
    title: title,
    id: newId,
    startHour: startHour,
    startMinute: startMinute,
    minuteLength: minuteLength,
  }

  this.setState((state, _) => {
    const shiftList = update(state.shifts,
			     {$push: [ newShift ]})
    storeShifts(shiftList)
    return {
      shifts: shiftList,
    }
  })

  return newShift
}

// archiving shift so their scheduled events don't break
function archiveShift (shift) {

  // the shift is not archived already
  if (!this.state.meta.archive.shifts.
      find(sh => sh.id === shift.id)) {

    const index = this.state.shifts.findIndex(sh => sh.id === shift.id)
    const newMeta = update(this.state.meta,
			   { archive: { shifts: { $push: [ shift ]}}})
    

    this.setState((state, _) => {
      storeMetaData(newMeta)

      return {
	meta: newMeta,
      }
    })

    this.setState((state, _) => {
      const newShiftList = update(state.shifts,
			       {$splice: [[index, 1]]})

      storeShifts(newShiftList)

      return {
	shifts: newShiftList,
      }
    })
    
    if (this.state.selected.shift === undefined)
      return
    
    // if the currently selected one is removed then select
    // another one if available
    if (this.state.selected.shift.id === shift.id) {
      const newSelected = this.state.shifts
	    .find(res => res.id !== shift.id)

      this.setState({
	selected: update(this.state.selected,
			 { shift: {$set: newSelected }})
      })
    }
  }
  
  // the shift is already archived
  else {
    const index = this.state.shifts.findIndex(sh => sh.id === sh.id)
    this.setState((state, _) => {
      const newShiftList = update(state.shifts,
				  {$splice: [[index, 1]]})

      storeShifts(newShiftList)

      return {
	shifts: newShiftList,
      }
    })
  }
  
}


export {
  createShift,
  archiveShift,
}
