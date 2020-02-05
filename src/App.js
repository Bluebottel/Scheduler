import React, { Component } from 'react'
import update from 'immutability-helper'
import Modal from 'react-modal'
import './App.css'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import PickerPanel from './pickerpanel'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'

import { loadResources, loadEvents,
	 storeEvents, storeResources,
	 storeShifts, loadShifts } from './storage'

import { storeTestData } from './testdata'
import colorMap from './colors'
import ModalMenu from './modalmenu'

// changing locale doesn't work without this
import 'moment/locale/sv'

moment.locale('sv')
const localizer = momentLocalizer(moment)

// this one has to be capitalized(?)
const DragCalendar = withDragAndDrop(Calendar)

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
      },
      optionsModalOpen: false,
    }

    this.moveEvent = this.moveEvent.bind(this)
    this.newEvent = this.newEvent.bind(this)
    this.removeEvent = this.removeEvent.bind(this)
    this.setSelected = this.setSelected.bind(this)
    this.getEventProp = this.getEventProp.bind(this)
  }

  moveEvent({ event, start, end, isAllDay: droppedOnAllDaySlot }) {

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

  newEvent(allSelected) {

    if (allSelected.slots.length === 2 && allSelected.action === 'click') {
      console.log('bugfix')
    }
    
    // find the largest and then increment to guarantee a unique event ID
    let eventId = 0
    this.state.events.forEach(event => {
      if (event.id > eventId)
	eventId = event.id
    })
    
    eventId += 1;

    let newEvents = []
    
    allSelected.slots.forEach(slot => {
      let selectedShift = this.state.selected.shift
      
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

  // double clicking an event removes it
  // TODO: add a warning + confirmation before removing
  removeEvent(argEvent, e) {
    this.setState((state, _) => {
      
      const newEventList = state.events.filter(elem => elem.id !== argEvent.id)
      storeEvents(newEventList)

      return {
	events: newEventList,
      }
    })
  }


  setSelected({ shift, resource }) {
    this.setState({
      selected: {
	shift: shift,
	resource: resource,
      }
    })
  }

  // TODO: check if the event is a meta event and show
  // total scheduled hours for that day instead
  // TODO: make and archive a copy of all resources ever so events don't get broken
  getEventProp(event, start, end, isSelected) {

    const resource = this.state.resources.find(res => res.id === event.resource)

    if (!resource) {
      console.log('no resource found: ', event, this.state.resources)
      return
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
	background: colorMap.get(resource.id % colorMap.size) }
    }
  }

  eventInfo(event) {
    console.log('event ID: ', event.id)
  }

  // TODO: make the background blurred when the modal is open
  render() {

    return (
      <div id = "container">
	<Modal
	  isOpen = { this.state.optionsModalOpen }
	  contentLabel = "Modal label"
	  onRequestClose = { () => this.setState({ optionsModalOpen: false }) }
	  shouldCloseOnOverlayClick = { true }
	  className = "optionsModal"
	  overlayClassName = "optionsModalOverlay"
	  ariaHideApp = { false }
	>
	  <ModalMenu
	    resources = { this.state.resources }
	    shifts = { this.state.shifts }
	  />
	</Modal>
	<div id = "calendar">
	  <DragCalendar
	    startAccessor = "start"
	    endAccessor = "end"
            localizer = { localizer }
            events = { this.state.events }
            onEventDrop = { this.moveEvent }
            onEventResize = { () => {} }
            onSelectSlot = { this.newEvent }
	    onSelectEvent = { (q) => this.eventInfo(q) }
            defaultView = "month"
            defaultDate = { new Date() }
	    eventPropGetter = { this.getEventProp }
	    dayPropGetter = { this.getDayProp }
	    selectable = { 'ignoreEvents' }
	    showMultiDayTimes = { true }
	    popup
	    components = {{
	      eventWrapper: ({event, children}) => (
		<div
		  onContextMenu = { e => {
		      this.removeEvent(event, e)
		      e.preventDefault()
		  }}>
		  
		  { children }
		</div>
	      ),
	    }}
	  />
	</div>
	<PickerPanel
	  resources = { this.state.resources }
	  shifts = { this.state.shifts }
	  selected = { this.state.selected }
	  setSelected = { this.setSelected }
	  optionsModalOpen = { this.state.optionsModalOpen }
	  setOptionsModal = { (value) => this.setState({
	      optionsModalOpen: value
	  }) }
	/>
      </div>
    )
  }
}

export default App
