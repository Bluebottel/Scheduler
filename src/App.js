import React, { Component } from 'react'
import update from 'immutability-helper'
import Modal from 'react-modal'

import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'

import { loadResources, loadEvents, loadShifts,
	 loadMetaData, storeData } from './storage'

import { moveEvent, addEvent, removeEvent,
	 eventRender, getEventProp, addEvents } from './events'

import { create, archive } from './utilities'

import './App.css'
import { storeTestData } from './testdata'
import ModalMenu from './modalmenu'
import PickerPanel from './pickerpanel'
import CustomEventModal from './customeventmodal'


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
      customEventModalOpen: false,
      meta: metaData,
      view: 'month',
    }

    // TODO: some better binding method
    this.moveEvent = moveEvent.bind(this)
    this.addEvents = addEvents.bind(this)
    this.addEvent = addEvent.bind(this)
    this.removeEvent = removeEvent.bind(this)
    this.eventRender = eventRender.bind(this)
    this.getEventProp = getEventProp.bind(this)

    this.create = create.bind(this)
    this.archive = archive.bind(this)
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
    storeData(newList, type)
  }

  
  // TODO: add a context menu instead of removing the event straight away
  render() {
    return (
      <div id = "container">
	<Modal
	  isOpen = { this.state.optionsModalOpen }
	  shouldCloseOnOverlayClick = { true }
	  className = "modalCommon optionsMenuModal"
	  overlayClassName = "modalOverlayCommon"
	  onAfterOpen = { () => document.getElementById('root')
					.style.filter = 'blur(2px)' }
	  onRequestClose = { () => {
	      document.getElementById('root').style.filter = ''
	      this.setState({ optionsModalOpen: false })
	  }}
	  ariaHideApp = { false }
	>
	  <ModalMenu
	    resources = { this.state.resources }
	    shifts = { this.state.shifts }
	    updateElement = { this.updateElement }
	    closeModal = { () => {
		// remove blur
		document.getElementById('root').style.filter = ''
		this.setState({ optionsModalOpen: false })
	    }}
	    archive = { this.archive }
	    create = { this.create }
	  />
	</Modal>

	<Modal
	  isOpen = { this.state.customEventModalOpen }
	  shouldCloseOnOverlayClick = { false }
	  className = "modalCommon customEventModal"
	  overlayClassName = "modalOverlayCommon"
	  onAfterOpen = { () => document.getElementById('root')
					.style.filter = 'blur(2px)' }
	  onRequestClose = { () => {
	      document.getElementById('root').style.filter = ''
	      this.setState({ customEventModalOpen: false })
	  }}
	  ariaHideApp = { false }
	>
	  <CustomEventModal
	    addEvent = { this.addEvent }
	    event = { this.state.customEvent }
	    closeModal = { () => {
		// remove blur
		document.getElementById('root').style.filter = ''
		this.setState({ customEventModalOpen: false })
	    }}
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
	    onDragStart = { console.log }
            onSelectSlot = { selection => {
		if (this.state.view === 'month' )
		  this.addEvents(selection)

		if (this.state.view === 'week' ) {
		  this.setState({
		    customEventModalOpen: true,
		    customEvent: {
		      start: selection.start,
		      end: selection.end,
		    }
		  })
		}

	    }}
            defaultView = "month"
            defaultDate = { new Date() }
	    eventPropGetter = { this.getEventProp }
	    selectable = { 'ignoreEvents' }
	    showMultiDayTimes = { true }
	    views = { ['month', 'week'] }
	    onView = { view => this.setState({ view: view })}
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
