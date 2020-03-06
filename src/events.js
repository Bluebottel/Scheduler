import React from 'react'
import update from 'immutability-helper'
import moment from 'moment'
import { storeData } from './storage'

function moveEvent ({ event, start, end, isAllDay: droppedOnAllDaySlot },
		    events) {

  //console.log(event, start, end, droppedOnAllDaySlot)

  const idx = events.findIndex(elem => elem.id === event.id)
  let allDay = event.allDay

  const updatedEvent = { ...event, start, end, isAllDay: false }

  const nextEvents = [...events]
  nextEvents.splice(idx, 1, updatedEvent)

  return nextEvents
}

// this will only ever be called from the month view
function addEvents (allSelected, events, selected) {

  // in case of empty lists
  if (!selected.resource || !selected.shift)
    return undefined

  // find the largest and then increment to guarantee a unique event ID
  let eventId = 0
  events.forEach(event => {
    if (event.id > eventId)
      eventId = event.id
  })

  eventId += 1
  let newEvents = []
  
  allSelected.slots.forEach(slot => {
    let selectedShift = selected.shift
    
    let startDate = slot
    startDate.setHours(selectedShift.startHour, selectedShift.startMinute, 0)
    let stopDate = moment(startDate).add(selectedShift.minuteLength, 'm').toDate()
    let newEvent = { 
      start: startDate,
      end: stopDate,
      allDay: false,
      id: eventId,
      resourceId: selected.resource.id,
      shiftId: selected.shift.id,
    }
    newEvents.push(newEvent)
    eventId++
  })

  return events.concat(newEvents)

}

function addEvent(event, events) {

  // find the largest and then increment to guarantee a unique event ID
  let eventId = 0
  events.forEach(ev => {
    if (ev.id > eventId)
      eventId = ev.id
  })

  event.id = eventId + 1
  return events.concat(event)
}

function removeEvent (target, events) {
  const newEventList = events.filter(elem => elem.id !== target.id)
  return newEventList
}

function eventRender ({ event }, state) {

  if (event.customTitle !== undefined) {
    return (
      <div>
	{ event.customTitle }
      </div>
    )
  }
  
  let resource = state.resources.find(res => res.id === event.resourceId)
  if (resource === undefined)
    resource = state.metaData.archive.resources
    .find(res => res.id === event.resourceId)

  let shift = state.shifts.find(sh => sh.id === event.shiftId)
  if (shift === undefined)
    shift = state.metaData.archive.shifts
    .find(sh => sh.id === event.shiftId)
  
  return (
      <div>
	{ resource.title + ', ' + shift.title }
      </div>
  )
}


// TODO: make a gradient background and let the rightmost part represent shift
//       and the rest the resource
function getEventProp (event, start, end, isSelected, state) {

  // custom events don't have resources/shifts linked to them
  if (event.customTitle !== undefined) {
    return {
      style: {
	background: event.color,
	cursor: 'grab',
      },
      className: 'eventPanel',
    }
  }
  
  let resource = state.resources.find(res => res.id === event.resourceId)

  // in case a resource has been removed
  if (resource === undefined)
    resource = state.metaData.archive.resources.find(res => res.id === event.resourceId)

  if (!resource) {
    console.log('no resource found: ', event)
    console.log(state.resources)
    return ''
  }

  return {
    style: {
      background: resource.color,
      cursor: 'grab',
    },
    className: 'eventPanel',
  }
}


export {
  moveEvent,
  removeEvent,
  eventRender,
  getEventProp,
  addEvent,
  addEvents,
}
