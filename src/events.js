import React from 'react'
import moment from 'moment'
import { storeData } from './storage'

function moveEvent ({ event, start, end, isAllDay: droppedOnAllDaySlot }) {

  const { events } = this.state
  const idx = events.findIndex(elem => elem.id === event.id)
  let allDay = event.allDay

  if (!event.allDay && droppedOnAllDaySlot) {
    allDay = true
  } else if (event.allDay && !droppedOnAllDaySlot) {
    allDay = false
  }

  const updatedEvent = { ...event, start, end, allDay }

  const nextEvents = [...events]
  nextEvents.splice(idx, 1, updatedEvent)

  this.setState({ events: nextEvents })
  storeData(this.state.events, 'events')

}

// this will only ever be called from the month view
function addEvents (allSelected) {

  // in case of empty lists
  if (!this.state.selected.resource || !this.state.selected.shift)
    return

  // find the largest and then increment to guarantee a unique event ID
  let eventId = 0
  this.state.events.forEach(event => {
    if (event.id > eventId)
      eventId = event.id
  })

  eventId += 1
  let newEvents = []
  
  allSelected.slots.forEach(slot => {
    let selectedShift = this.state.selected.shift
    
    let startDate = slot
    startDate.setHours(selectedShift.startHour, selectedShift.startMinute, 0)
    let stopDate = moment(startDate).add(selectedShift.minuteLength, 'm').toDate()
    let newEvent = { 
      start: startDate,
      end: stopDate,
      allDay: false,
      id: eventId,
      resourceId: this.state.selected.resource.id,
      shiftId: this.state.selected.shift.id,
    }
    newEvents.push(newEvent)
    eventId++
  })

  this.setState((state, _) => {
    storeData(state.events.concat(newEvents), 'events')

    return {
      events: state.events.concat(newEvents)
    }
  })
}

function addEvent(event) {

  // find the largest and then increment to guarantee a unique event ID
  let eventId = 0
  this.state.events.forEach(ev => {
    if (ev.id > eventId)
      eventId = ev.id
  })

  event.id = eventId + 1

  this.setState((state, _) => {
    storeData(state.events.concat(event), 'events')

    return {
      events: state.events.concat(event)
    }
  })
  
}

function removeEvent (argEvent, e) {
  this.setState((state, _) => {
    
    const newEventList = state.events.filter(elem => elem.id !== argEvent.id)
    storeData(newEventList, 'events')

    return {
      events: newEventList,
    }
  })
}

function eventRender ({ event }) {

  if (event.customTitle !== undefined) {
    return (
      <div>
      { event.customTitle }
      </div>
    )
  }
  
  let resource = this.state.resources.find(res => res.id === event.resourceId)
  if (resource === undefined)
    resource = this.state.meta.archive.resources
    .find(res => res.id === event.resourceId)
  let shift = this.state.shifts.find(sh => sh.id === event.shiftId)
  
  return (
      <div>
      { resource.title + ', ' + shift.title }
    </div>
  )
}


  // TODO: check if the event is a meta event and show total scheduled hours for
  //       that day instead
  // TODO: make a gradient background and let the rightmost part represent shift
  //       and the rest the resource
function getEventProp (event, start, end, isSelected) {

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
  
  let resource = this.state.resources.find(res => res.id === event.resourceId)

  // in case a resource has been removed
  if (resource === undefined)
    resource = this.state.meta.archive
    .resources.find(res => res.id === event.resourceId)

  if (!resource) {
    console.log('no resource found: ', event)
    console.log(this.state.resources)
    return ''
  }

  
  if (resource.title === "#META_INFO#") {
    return {
      style: {
	background: 'none',
	border: 'none',
      }
    }
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
