import React, { Component } from 'react'
import './App.css'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop"
import "react-big-calendar/lib/css/react-big-calendar.css"
import "react-big-calendar/lib/addons/dragAndDrop/styles.css"

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

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      events: eventList,
    }

    this.moveEvent = this.moveEvent.bind(this)
    this.newEvent = this.newEvent.bind(this)
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

    // alert(`${event.title} was dropped onto ${updatedEvent.start}`)
  }

  // Resizing doesn't make sense so keep it disabled
  resizeEvent = ({ event, start, end }) => {
    /*const { events } = this.state

    const nextEvents = events.map(existingEvent => {
      return existingEvent.id === event.id
           ? { ...existingEvent, start, end }
           : existingEvent
    })

    this.setState({
      events: nextEvents,
    })
    */

    //alert(`${event.title} was resized to ${start}-${end}`)
  }

  newEvent() { console.log('new event trigger') }

  // TODO: remove the event
  onDoubleClickEvent(event, e) {
    console.log('double clicked on ', event)
  }

  // TOOD: un-highlight the rest of them
  highlight(event) {
    event.target.style.background = "#c3bebe"
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
            onDragStart={console.log}
            defaultView="month"
            defaultDate={new Date()}
	    eventPropGetter={getEventProp}
	    onDoubleClickEvent={this.onDoubleClickEvent}
	  />
	</div>
	<div id="sideContainer">
	  <div className="boxLabel">Pass</div>
	  <div className="pickerBox">
	    <div className="option">
	      Stuff inside
	    </div>
	  </div>
	  <div className="boxLabel">Personer</div>
	  <div className="pickerBox">
	    <div className="option" onClick={this.highlight}>
	      Stuff inside
	    </div>
	  </div>
	</div>
      </div>
    )
  }
}

export default App
