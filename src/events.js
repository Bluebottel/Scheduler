import React from 'react'
import moment from 'moment'
import { storeEvents } from './storage'

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
  storeEvents(this.state.events)

}

// the calendar doesn't have an hooks for the specific views
// (week etc.) so the only thing differentiating is the mix
// of the number of slots, time between them and typ of action
function customEventTrigger(selection, step) {

  console.log('step: ', step)
  if (selection.action !== 'select') return false
  if (selection.slots.length < 2) return false

  let first = moment(selection.slots[0])
  let second = moment(selection.slots[1])

  // the week view has increments of 30 minutes
  if (moment.duration(
      second.diff(first)).as('minutes') !== step) {
    return false
  }

  //console.log(moment.duration(second.diff(first)).as('minutes') === 30)

  return true
}

function newEvent (allSelected) {

  if (customEventTrigger(allSelected, this.state.step)) {
    console.log('custom event!', allSelected)

    return
  }
  
  // clicking a single slot in the week view generates
  // two slots and should be ignored
  if (allSelected.action === 'click'
      && allSelected.slots.length > 1)
    return
  
  // in case of empty lists
  if (!this.state.selected.resource || !this.state.selected.shift)
    return

  // find the largest and then increment to guarantee a unique event ID
  let eventId = 0
  this.state.events.forEach(event => {
    if (event.id > eventId)
      eventId = event.id
  })

  if (allSelected.action === 'click')
    console.log('click')

  eventId += 1
  let newEvents = []
  
  allSelected.slots.forEach(slot => {

    console.log('slot: ', slot)
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
    eventId++;
  })

  this.setState((state, _) => {
    storeEvents(state.events.concat(newEvents))

    return {
      events: state.events.concat(newEvents)
    }
  })
}

// TODO: add a warning + confirmation before removing
function removeEvent (argEvent, e) {
  this.setState((state, _) => {
    
    const newEventList = state.events.filter(elem => elem.id !== argEvent.id)
    storeEvents(newEventList)

    return {
      events: newEventList,
    }
  })
}

function eventRender ({ event }) {

  let resource = this.state.resources.find(res => res.id === event.resourceId)
  if (resource === undefined)
    resource = this.state.meta.archive.resources
    .find(res => res.id === event.resourceId)
  let shift = this.state.shifts.find(sh => sh.id === event.shiftId)

  let title = ''
  if (!event.customTitle)
    title = resource.title + ', ' + shift.title
  else title = event.customTitle
  
  return (
      <div>
      { title }
    </div>
  )
}


  // TODO: check if the event is a meta event and show total scheduled hours for
  //       that day instead
  // TODO: make a gradient background and let the rightmost part represent shift
  //       and the rest of the resource
function getEventProp (event, start, end, isSelected) {

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
  newEvent,
  removeEvent,
  eventRender,
  getEventProp,
}
