import React from 'react'
import './App.css'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop"
import "react-big-calendar/lib/css/react-big-calendar.css"
import "react-big-calendar/lib/addons/dragAndDrop/styles.css"

// changing locale doesn't work without this
import 'moment/locale/sv'

// Setup the localizer by providing the moment (or globalize) Object
// to the correct localizer.

moment.locale('sv')
const localizer = momentLocalizer(moment)

// this one has to be capitalized(?!)
const DragCalendar = withDragAndDrop(Calendar)

function App() {

  const eventList = []
  return (
    <div id="container">
      <div id="calendar">
	<DragCalendar
	  localizer={localizer}
	  startAccessor="start"
	  events={eventList}
	  endAccessor="end"
	  style={{
	    height: "800px",
	    width: "1000px",
	    padding: "5px"
	  }}
	  defaultView="month"
	/>	
      </div>
      <div className="pickerBox">
	Pass
      </div>
      <div className="pickerBox">
	Personer
      </div>
    </div>
  )
}

export default App
