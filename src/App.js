import React from 'react'
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

function App() {

  const now = new Date()
  const eventList = [
    { title: "KIM, EM",
      start: new Date(),
      end: now },
    { title: "OLO, EM",
      start: new Date(),
      end: now },
    { title: "SOF, N",
      start: new Date(),
      end: new Date(new Date().getTime()+14*1000*3600) }
  ]
  return (
    <div id="container">
      <div id="calendar">
	<DragCalendar
	  localizer={localizer}
	  startAccessor="start"
	  events={eventList}
	  endAccessor="end"
	  defaultView="month"
	/>
      </div>
      <div id="sideContainer">
	<div className="pickerBox">
	  Pass
	</div>
	<div className="pickerBox">
	  Personer
	</div>
      </div>
    </div>
  )
}

export default App
