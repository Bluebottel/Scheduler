import React, { Component } from 'react'
import update from 'immutability-helper'
import './App.css'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import PickerPanel from './pickerpanel'
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop"
import 'react-big-calendar/lib/css/react-big-calendar.css'
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'

import { loadResources, loadEvents,
	 storeEvents, storeResources,
	 storeShifts, loadShifts } from './storage'

import { storeTestData } from './testdata'

// changing locale doesn't work without this
import 'moment/locale/sv'

moment.locale('sv')
const localizer = momentLocalizer(moment)

// this one has to be capitalized(?)
const DragCalendar = withDragAndDrop(Calendar)

// TODO: make this return different colors depending on the
// resource, ie person, attached. Make a map
// TODO: check if the event is a meta event and show
// total scheduled hours for that day instead
function getEventProp(event, start, end, isSelected) {
  return { style: { background: 'red' }}
}

class App extends Component {
  constructor(props) {
    super(props)

    const events = loadEvents()
    const resources = loadResources()
    const shifts = loadShifts()

    this.state = {
      events: events,
      resources: resources,
      shifts: shifts,
      selected: {
	shift: shifts[0],
	resource: resources[0],
      }
    }

    this.moveEvent = this.moveEvent.bind(this)
    this.newEvent = this.newEvent.bind(this)
    this.onDoubleClickEvent = this.onDoubleClickEvent.bind(this)
    this.setSelected = this.setSelected.bind(this)
  }

  moveEvent({ event, start, end, isAllDay: droppedOnAllDaySlot }) {
    const { events } = this.state
    const idx = events.indexOf(event)
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

    //console.log(`${event.title} was dropped onto ${updatedEvent.start}`)
  }

  newEvent(allSelected) {
    
    let newId = this.state.events[this.state.events.length-1].id + 1

    allSelected.slots.forEach(slot => {
      let selectedShift = this.state.selected.shift

      // find the largest and then increment to guarantee a unique event ID
      let eventId = 0
      this.state.events.forEach(event => {
	if (event.id > eventId)
	  eventId = event.id
      })
      eventId++

      let startDate = slot
      startDate.setHours(selectedShift.startHour, selectedShift.startMinute, 0)
      let stopDate = moment(startDate).add(selectedShift.minuteLength, 'm').toDate()
      let newEvent = {
	title: this.state.selected.resource.title + ', ' +
	       this.state.selected.shift.title,
	start: startDate,
	end: stopDate,
	allDay: false,
	id: eventId,
	resource: this.state.selected.resource.id,
	
      }

      this.setState({
	events: update(this.state.events, {$push: [newEvent]})
      })

      storeEvents(this.state.events)
    }) 
  }

  // double clicking an event removes it
  // TODO: add a warning + confirmation before removing
  onDoubleClickEvent(argEvent, e) {

    let newEventList = this.state.events.filter(elem => elem.id !== argEvent.id)

    this.setState({
      events: update(this.state.events, {$set: newEventList})
    })
    storeEvents(newEventList)
  }


  setSelected({ shift, resource }) {
    this.setState({
      selected: {
	shift: shift,
	resource: resource,
      }
    })
  }

  render() {
    return (
      <div id = "container">
	<div id = "calendar">
	  <DragCalendar
            localizer = { localizer }
            events = { this.state.events }
            onEventDrop = { this.moveEvent }
            onEventResize = { () => {} }
            onSelectSlot = { this.newEvent }
	    onSelectEvent = { () => { console.log('kitten') } }
            defaultView = "month"
            defaultDate = { new Date() }
	    eventPropGetter = { getEventProp }
	    onDoubleClickEvent = { this.onDoubleClickEvent }
	    dayPropGetter = { this.getDayProp }
	    selectable
	  />
	</div>
	<PickerPanel
	  resources = { this.state.resources }
	  shifts = { this.state.shifts }
	  selected = { this.state.selected }
	  setSelected = { this.setSelected }
	/>
      </div>
    )
  }
}

export default App
