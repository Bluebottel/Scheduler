import React, { Component } from 'react'
import update from 'immutability-helper'
import Modal from 'react-modal'

import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'

import { loadResources, loadEvents,
	 storeEvents, storeResources,
	 storeShifts, loadShifts,
	 storeMetaData, loadMetaData } from './storage'

import './App.css'
import { storeTestData } from './testdata'
import colorMap from './colors'
import ModalMenu from './modalmenu'
import PickerPanel from './pickerpanel'

// changing locale doesn't work without this
import 'moment/locale/sv'

moment.locale('sv')
const localizer = momentLocalizer(moment)

// this one has to be capitalized(?)
const DragCalendar = withDragAndDrop(Calendar)

class App extends Component {
  constructor(props) {
    super(props)

    //storeTestData()

    const events = loadEvents()
    const resources = loadResources()
    const shifts = loadShifts()
    const metaData = loadMetaData()

    this.state = {
      events: events,
      resources: resources,
      shifts: shifts,
      selected: {
	shift: shifts[0],
	resource: resources[0],
      },
      optionsModalOpen: false,
      meta: metaData,
    }

    console.log('state: ', this.state.resources,
		this.state.shifts, this.state.meta)
  }

  moveEvent = ({ event, start, end, isAllDay: droppedOnAllDaySlot }) => {

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

  newEvent = (allSelected) => {

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
  
  removeEvent = (argEvent, e) => {
    this.setState((state, _) => {
      
      const newEventList = state.events.filter(elem => elem.id !== argEvent.id)
      storeEvents(newEventList)

      return {
	events: newEventList,
      }
    })
  }

  setSelected = ({ shift, resource }) => {
    this.setState({
      selected: {
	shift: shift,
	resource: resource,
      }
    })
  }

  // TODO: check if the event is a meta event and show total scheduled hours for
  //       that day instead
  // TODO: make and archive a copy of all resources ever so events don't get broken
  // TODO: make a gradient background and let the rightmost part represent shift
  //       and the rest of the resource
  getEventProp = (event, start, end, isSelected) => {

    let resource = this.state.resources.find(res => res.id === event.resourceId)

    // in case a resource has been removed
    if (resource === undefined)
      resource = this.state.meta.archive.resources.find(res => res.id === event.resourceId)

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

  eventRender = ({ event }) => {

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

  updateElement = (newElement, type) => {

    let index = this.state[type].findIndex(elem => elem.id === newElement.id)
    if (type === 'resources' && index === -1)
      index = this.state.meta.archive.findIndex(res => res.id === newElement.id)
    
    const newList = update(this.state[type], {$splice: [[index, true, newElement]]})

    this.setState({ [type]: newList })

    if (type === 'shifts') storeShifts(newList)
    else if (type === 'resources') storeResources(newList)
    
  }

  createResource = (title, color) => {
    // make sure that the new ID is unique by making it larger than every other ID
    // including removed resources since those can still have events tied to them
    let newId = 0
    this.state.resources.forEach(res => { if (res.id >= newId) { newId = res.id }})
    this.state.meta.archive.resources
	.forEach(res => { if (res.id >= newId) { newId = res.id }})
    newId++;
    
    const newResource = {
      title: title,
      id: newId,
      color: color,
      resourceTitleAccessor: () => title,
      resourceIdAccessor: () => newId,
    }

    this.setState((state, _) => {
      const resourceList = update(state.resources,
				  {$push: [ newResource ]})
      storeResources(resourceList)
      return {
	resources: resourceList,
      }
    })

    return newResource
  }

  // archiving resource so their scheduled events don't break
  archiveResource = (resource) => {

    // the resource is not archived already
    if (!this.state.meta.archive.resources.
	     find(res => res.id === resource.id)) {

      const index = this.state.resources.findIndex(res => res.id === resource.id)
      const newMeta = update(this.state.meta,
			     { archive: { resources: { $push: [ resource ]}}})
      

      this.setState((state, _) => {
	storeMetaData(newMeta)

	return {
	  meta: newMeta,
	}
      })

      this.setState((state, _) => {
	const newResourceList = update(state.resources,
				       {$splice: [[index, 1]]})

	console.log('new resourcelist: ', newResourceList)
	storeResources(newResourceList)

	return {
	  resources: newResourceList,
	}
      })
    }
    
    // the resource is already archived
    else {
      const index = this.state.resources.findIndex(res => res.id === resource.id)
      this.setState((state, _) => {
	const newResourceList = update(state.resources,
				       {$splice: [[index, 1]]})

	console.log('new resourcelist: ', newResourceList)
	storeResources(newResourceList)

	return {
	  resources: newResourceList,
	}
      })
    }
    
  }

  // TODO: add a context menu instead of removing the event straight away
  render() {

    return (
      <div id = "container">
	<Modal
	  isOpen = { this.state.optionsModalOpen }
	  onRequestClose = { () => this.setState({ optionsModalOpen: false }) }
	  shouldCloseOnOverlayClick = { true }
	  className = "optionsModal"
	  overlayClassName = "optionsModalOverlay"
	  ariaHideApp = { false }
	  onAfterOpen = { () => document.getElementById('root').style.filter = 'blur(2px)' }
	  onRequestClose = { () => {
	      document.getElementById('root').style.filter = ''
	      this.setState({ optionsModalOpen: false })
	  }}
	>
	  <ModalMenu
	    resources = { this.state.resources }
	    shifts = { this.state.shifts }
	    updateElement = { this.updateElement }
	    closeModal = { () => {
		document.getElementById('root').style.filter = ''
		this.setState({ optionsModalOpen: false })
	    }}
	    archiveResource = { this.archiveResource }
	    createResource = { this.createResource }
	  />
	</Modal>
	<div id = "calendar">
	  <DragCalendar
	    startAccessor = "start"
	    endAccessor = "end"
            localizer = { localizer }
            events = { this.state.events }
            onEventDrop = { (argEvent, e) => {
		document.body.style.cursor = 'default'
		this.moveEvent(argEvent, e)
	    }}
	  
	    onDragStart = { () => document.body.style.cursor = 'grabbing' }
            onEventResize = { () => {} }
            onSelectSlot = { this.newEvent }
            defaultView = "month"
            defaultDate = { new Date() }
	    eventPropGetter = { this.getEventProp }
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
	      event: this.eventRender,
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
