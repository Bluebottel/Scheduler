import React, { Component } from 'react'
import './App.css'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop"
import 'react-big-calendar/lib/css/react-big-calendar.css'
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'

import { loadResources, loadEvents,
	 storeEvents, storeResources,
	 storeShifts, loadShifts } from './storage'

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

const eventList = [
  {
    title: 'KIM, EM',
    start: new Date(),
    end: new Date(),
    allDay: false,
    id: 0,
    resource: '0',
  },
  {
    title: 'OLO, EM',
    start: new Date(),
    end: new Date(),
    id: 1
  },
  {
    title: 'SOF, N',
    start: new Date(),
    end: new Date(new Date().getTime()+20*1000*3600),
    id: 2
  }
]

const resourceList = [
  {
    resourceIdAccessor: 0,
    resourceTitleAccessor: 'Alice',    			    
  },
  {
    resourceIdAccessor: 1,
    resourceTitleAccessor: 'Bob',    			    
  },
  {
    resourceIdAccessor: 0,
    resourceTitleAccessor: 'Chloe',    			    
  },  
]

const shifts = [
  {
    title: 'FM',
    startHour: 7,
    startMinute: 0,
    minuteLength: 600,
  },
  {
    title: 'EM',
    startHour: 12,
    startMinute: 30,
    minuteLength: 540,
  },
  {
    title: 'Natt',
    startHour: 21,
    startMinute: 30,
    minuteLength: 570,
  }
]

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

    //console.log(`${event.title} was dropped onto ${updatedEvent.start}`)
  }

  newEvent(event) {
    console.log('new event trigger ', event)
  }

  // TODO: remove the event
  onDoubleClickEvent(event, e) {
    console.log('double clicked on ', event)
  }

  // TODO: un-highlight the rest of them
  highlight(event) {
    event.target.style.background = "#c3bebe"
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
      <div id="container">
	<div id="calendar">
	  <DragCalendar
            localizer={localizer}
            events={this.state.events}
            onEventDrop={this.moveEvent}
            onEventResize={() => {}}
            onSelectSlot={this.newEvent}
            defaultView="month"
            defaultDate={new Date()}
	    eventPropGetter={getEventProp}
	    onDoubleClickEvent={this.onDoubleClickEvent}
	    dayPropGetter={this.getDayProp}
	    selectable
	  />
	</div>
	<div id="sideContainer">
	  <div className="boxLabel">Pass</div>
	  <div className="pickerBox">
	    {
	      this.state.shifts.map(res => {
		return (
		  <div className="option" onClick={this.highlight}>
		    { res['title'] }
		  </div>
		)
	      }) 
	    }
	  </div>
	  <div className="boxLabel">Personer</div>
	  <div className="pickerBox">
	    {
	      this.state.resources.map(res => {
		return (
		  <div className="option" onClick={this.highlight}>
		    {res.resourceTitleAccessor}
		  </div>
		)
	      }) 
	    }
	  </div>
	</div>
      </div>
    )
  }
}

export default App
