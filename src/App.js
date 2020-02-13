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

import { moveEvent, newEvent, removeEvent,
	 eventRender, getEventProp } from './events'

import { createResource, archiveResource } from './resources'
import { createShift, archiveShift } from './shifts'

import './App.css'
import { storeTestData } from './testdata'
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

    // TODO: some better binding method
    this.moveEvent = moveEvent.bind(this)
    this.newEvent = newEvent.bind(this)
    this.removeEvent = removeEvent.bind(this)
    this.eventRender = eventRender.bind(this)
    this.getEventProp = getEventProp.bind(this)

    this.createResource = createResource.bind(this)
    this.archiveResource = archiveResource.bind(this)

    this.createShift = createShift.bind(this)
    this.archiveShift = archiveShift.bind(this)
  }

  setSelected = ({ shift, resource }) => {
    this.setState({
      selected: {
	shift: shift,
	resource: resource,
      }
    })
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
	  onAfterOpen = { () => document.getElementById('root')
					.style.filter = 'blur(2px)' }
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
	    archiveShift = { this.archiveShift }
	    createShift = { this.createShift }
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
