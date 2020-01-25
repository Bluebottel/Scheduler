import React, { Component } from 'react'
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
    }

    this.moveEvent = this.moveEvent.bind(this)
    this.newEvent = this.newEvent.bind(this)
  }

  moveEvent({ event, start, end, isAllDay: droppedOnAllDaySlot }) {
    console.log('moveEvent start')
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

  newEvent(event) {
    console.log('new event trigger ', event)
  }

  // TODO: remove the event
  onDoubleClickEvent(event, e) {
    console.log('double clicked on ', event)
  }

  // TODO: check if the event is a meta event and show
  // total scheduled hours for that day instead
  getDayProp = date => {
    return {
      className: 'special-day',
      /* style: { background: 'white' } */
    }
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
	  resources = {this.state.resources}
	  shifts = {this.state.shifts}
	/>
      </div>
    )
  }
}

export default App
