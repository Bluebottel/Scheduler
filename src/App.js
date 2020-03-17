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

import { create, archive, sortComparer, timeOverlap } from './utilities'

import './App.css'
//import { storeTestData } from './testdata'
import ModalMenu from './modalmenu'
import PickerPanel from './pickerpanel'
import EditEventModal from './editeventmodal'
import PackageTour from './packagetour'

// changing locale doesn't work without this
import 'moment/locale/sv'

moment.locale('sv')
const localizer = momentLocalizer(moment)

// this one has to be capitalized(?)
const DragCalendar = withDragAndDrop(Calendar)

class App extends Component {
  constructor(props) {
    super(props)
    
    // read data from localStorage
    const events = loadEvents()
    const resources = loadResources()
    const shifts = loadShifts()
    const metaData = loadMetaData()
    
    this.state = {
      events: events,
      resources: resources.sort(sortComparer('resources')),
      shifts: shifts.sort(sortComparer('shifts')),
      selected: {
	shift: shifts[0],
	resource: resources[0],
      },
      optionsModalOpen: false,
      editEventModalOpen: false,
      metaData: metaData,
      view: 'month',
      viewDate: new Date(),
    }
  }

  advanceTutorial = () => {
    this.setState((state, _) => {
      state.metaData.tutorial.stepIndex++;
      return {
	metaData: state.metaData
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

  updateElement = (newElement, type) => {

    let index = this.state[type]
		    .findIndex(elem => elem.id === newElement.id)
    if (type === 'resources' && index === -1)
      index = this.state.metaData.archive
		  .findIndex(res => res.id === newElement.id)

    const newList = update(this.state[type],
			   {$splice: [[index, true, newElement]]})
    let newEventList = this.state.events

    // if a shift is updated then all the events associated with it
    // has to have their start and end dates updated
    if (type === 'shifts') {
      newEventList = this.state.events.map(event => {
	if (event.shiftId === newElement.id) {
	  event.start.setHours(newElement.startHour,
			       newElement.startMinute, 0)
	  event.end = moment(event.start)
	    .add(newElement.minuteLength, 'm')
	    .toDate()
	}
	
	return event
      })
      
      storeData(newEventList, 'events')
    }

    this.setState({
      [type]: newList.sort(sortComparer(type)),
      events: newEventList,
    })
    storeData(newList, type)
  }


  // TODO: add a context menu instead of removing the event straight away
  render() {
    // don't render the pickerPanel when in week mode so the app
    // is slightly more usable on mobile devices since the panel
    // isn't used in that mode anyway
    
    let pickerPanel = ''

    if (this.state.view === 'month') {
      pickerPanel = (
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
      )
    }

    return (
      <div id = "container">
	<PackageTour
	  parentState = { this.state }
	  stepIndex = { this.state.metaData.tutorial.stepIndex }
	  setStep = { newStep => {
	      this.setState({
		metaData: update(this.state.metaData, {
		  tutorial: {
		    stepIndex: {$set: newStep}
		  }}),
	      })
	  }}
	  run = { !this.state.metaData.tutorial.done }
	  done = { () => {
	      this.setState((state, _) => {
		state.metaData.tutorial = {
		  done: true,
		  stepIndex: 0,
		}
		
		storeData(state.metaData, 'metaData')
		return {
		  metaData: state.metaData,
		}
	      })
	  }}
	/>
	
	<Modal
	  isOpen = { this.state.optionsModalOpen }
	  shouldCloseOnOverlayClick = { false }
	  className = "modalCommon optionsMenuModal"
	  overlayClassName = "modalOverlayCommon"
	  onAfterOpen = { () => {
	      document.getElementById('root')
		      .style.filter = 'blur(2px)'

	      if (this.state.metaData.tutorial.done) return
	      this.setState((state, props) => {

		// TODO: some better check in case we go back into the menu
		if (!state.metaData.tutorial.done) {
		  state.metaData.tutorial.stepIndex++;
		}

		return {
		  metaData: state.metaData,
		}
	      })
	  }}
	  
	  onRequestClose = { () => {
	      document.getElementById('root').style.filter = ''
	      this.setState((state, props) => {
		state.optionsModalOpen = false

		return state
	      })
	  }}
	  
	  ariaHideApp = { false }
	>
	  <ModalMenu
	    resources = { this.state.resources }
	    shifts = { this.state.shifts }
	    updateElement = { (elem, type) => {
		this.advanceTutorial()
		this.updateElement(elem, type)
	    }}
	    closeModal = { () => {
		// remove blur
		document.getElementById('root').style.filter = ''
		this.setState((state, props) => {

		  if (!state.metaData.tutorial.done) {
		    state.metaData.tutorial.stepIndex++;
		  }

		  return {
		    optionsModalOpen: false,
		    metaData: state.metaData,
		  }
		})
	    }}
	    archive = { (element, type) => {
		// select another element when the currently selected
		// one gets removed
		
		const newData = archive(element, type, this.state)
		const replacement = this.state[type]
					.find(ele => ele.id !== element.id )

		// slice to go from 'resourceS' -> 'resource'
		this.setState({
		  selected: update(this.state.selected,
				   {[type.slice(0,-1)]: {$set: replacement}}),
		  [type]: newData[type],
		  metaData: newData.metaData,
		})

		storeData(newData[type], type)
		storeData(newData.metaData, 'metaData')
	    }}
	  
	    create = { (element, type) => {
		let created = create(element, type, this.state)

		// if it's the first resource or shift created then
		// make it selected
		if (!this.state.selected[type.slice(0,-1)]) {
		  this.setState({
		    selected: update(this.state.selected,
				     {[type.slice(0,-1)]: {$set: created.newElement }}),
		  })
		}

		this.setState({ [type]: created.newElementList })
		storeData(created.newElementList, type)
	    }}

	    insert = { newData => {
		// used in modalmenu to insert the new state from a
		// loaded file
		// TODO: display the created date somewhere
		// TODO: check version

		newData.shifts.sort(sortComparer('shifts'))
		newData.resources.sort(sortComparer('resources'))

		this.setState({
		  events: newData.events,
		  shifts: newData.shifts,
		  resources: newData.resources,
		  metaData: newData.metaData,
		  selected: {
		    resource: newData.resources[0],
		    shift: newData.shifts[0]
		  }
		})
	    }}

	    setRules = { newRules => {
		let newMetaData = update(this.state.metaData,
					 {rules: {$set: newRules }})
		
		storeData(newMetaData, 'metaData')
		this.setState({
		  metaData: newMetaData,
		})
	    }}
	    rules = { this.state.metaData.rules }
	    advanceTutorial = { this.advanceTutorial }
	  />
	</Modal>

	<Modal
	  isOpen = { this.state.editEventModalOpen }
	  shouldCloseOnOverlayClick = { false }
	  className = "modalCommon editEventModal"
	  overlayClassName = "modalOverlayCommon"
	  onAfterOpen = { () => document.getElementById('root')
					.style.filter = 'blur(2px)' }
	  onRequestClose = { () => {
	      document.getElementById('root').style.filter = ''
	      this.setState((state, props) => {

		// advance the tutorial one step and switch to the month view
		if (!state.metaData.tutorial.done) {
		  state.metaData.tutorial.stepIndex++;
		  state.view = 'month'
		}

		return {
		  editEventModalOpen: false,
		  metaData: state.metaData,
		}
	      })
	  }}
	  ariaHideApp = { false }
	>
	  <EditEventModal
	    addEvent = { newEvent => {
		const newEventList = addEvent(newEvent, this.state.events)

		this.setState({ events: newEventList })
		storeData(newEventList, 'events')
	    }}
	    event = { this.state.eventBasis }
	    editEvent = { replacement => {
		const index = this.state.events
				  .findIndex(ev => ev.id === replacement.id )

		const newList = update(this.state.events,
				       {$splice: [[index, true, replacement]]})

		this.setState({ events: newList })
		storeData(newList, 'events')
	    }}
	    closeModal = { () => {
		// remove blur
		document.getElementById('root').style.filter = ''
		this.setState((state, _) => {
		  state.editEventModalOpen = false

		  if (!state.metaData.tutorial.done) {
		    state.metaData.tutorial.stepIndex++;
		    state.view = 'month'
		  }

		  return {
		    editEventModalOpen: state.editEventModalOpen,
		    metaData: state.metaData,
		    view: state.view,
		  }
		  
		})
	    }}
	  />
	</Modal>

	<div id = "calendar">
	  <DragCalendar
	    resizableAccessor={ () => false }
	    startAccessor = "start"
	    endAccessor = "end"
	    onDrillDown = { date => {
		this.setState({
		  viewDate: date,
		  view: 'week',
		})
	    }}
            localizer = { localizer }
            events = { this.state.events }
	    onEventDrop = { (eventObj) => {
		const newEventList = moveEvent(eventObj, this.state.events)
		this.setState({ events: newEventList })
		storeData(newEventList, 'events')
	    }}
	    onDragStart = { console.log }
            onSelectSlot = { selection => {
		if (this.state.view === 'month'
		    && (this.state.selected.resource === undefined
		     || this.state.selected.shift === undefined)) {
		  return
		}
		if (this.state.view === 'month' ) {
		  const newEventList = addEvents(selection,
						 this.state.events,
						 this.state.selected)
		  this.setState({ events: newEventList })
		  storeData(newEventList, 'events')
		}
		
		if (this.state.view === 'week' ) {
		  console.log('weekstuff')
		  this.setState((state, props) => {

		    if (!state.metaData.tutorial.done)
		      state.metaData.tutorial.stepIndex++;

		    return {
		      metaData: state.metaData,
		      editEventModalOpen: true,
		      eventBasis: {
			start: selection.start,
			end: selection.end,
		      }
		    }
		  })
		}

	    }}
	  
	    onDoubleClickEvent = { (event, e) => {

		let resolvedColor, resolvedTitle

		// custome events don't have resources associated with them
		if (event.customTitle !== undefined ) {
		  resolvedColor = event.color
		  resolvedTitle = event.title
		}
		else {
		  const resource = this.state.resources
				       .find(res => res.id === event.resourceId)
				|| this.state.metaData.archive.resources
				       .find(res => res.id === event.resourceId )
		  const shift = this.state.shifts.find(sh => sh.id === event.shiftId)
			     || this.state.metaData.archive.shifts
				    .find(sh => sh.id === event.shiftId )

		  resolvedColor = resource.color
		  resolvedTitle = resource.title + ', ' + shift.title + '*'
		}
		
		this.setState({
		  eventBasis: {
		    ...event,
		    color: resolvedColor,
		    title: resolvedTitle,
		  },
		  editEventModalOpen: true,
		})
	    }}
            defaultView = { 'month' }
	    view = { this.state.view }
            defaultDate = { this.state.viewDate }
	    date = { this.state.viewDate }
	    eventPropGetter = { (event, start, end, isSelected) => {
		return getEventProp(event, start,
				    end, isSelected,
				    this.state)
	    }}
	    selectable = { 'ignoreEvents' }
	    views = { ['month', 'week'] }
	    onView = { view => {
		this.setState((state, props) => {
		  state.view = view

		  if (!this.state.metaData.tutorial.done)
		    state.metaData.tutorial.stepIndex++;

		  // coming back to the month view a second time is only
		  // done at the end of the tutorial
		  if (view === 'month'
		      && !this.state.metaData.tutorial.done
		      && this.state.metaData.tutorial.stepIndex > 1) {
		    
		    state.metaData.tutorial = {
		      stepIndex: 0,
		      done: true,
		    }
		    
		    storeData(state.metaData, 'metaData')
		  }

		  return {
		    view: view,
		    metaData: state.metaData
		  }
		})
	    }}
	    onNavigate = { newDate => { this.setState({ viewDate: newDate }) }}
	    step = { 60 }
	    popup
	    components = {{
	      eventWrapper: ({event, children}) => (
		<div
		  onContextMenu = { e => {
		      const newEventList = removeEvent(event, this.state.events)
		      this.setState({ events: newEventList })
		      storeData(newEventList, 'events')
		      e.preventDefault()
		  }}>
		  { children }
		</div>
	      ),
	      event: args => { return eventRender(args, this.state) },
	      dateCellWrapper: cellProps => {
		
		const style = {
		  display: 'flex',
		  position: 'relative',
		  flex: 1,
		  borderLeft: '1px solid #DDD',
		}

		let calendarDay = {
		  start: cellProps.value,
		  end: moment(cellProps.value).endOf('day')
		}
		
		let scheduledHours = 0
		
		this.state.events.forEach(elem => {
		  scheduledHours += timeOverlap(calendarDay, {
		    start: moment(elem.start),
		    end: moment(elem.end),
		  })
		})

		// ms -> hours
		scheduledHours = scheduledHours / (60*60*1000)

		let tag = '', background

		// note that this always runs all conditions meaning
		// more than one rule can apply
		// TODO: warn about multiple hits (?)
		this.state.metaData.rules.forEach(rule => {
		  if (rule.condition(scheduledHours))
		    background = rule.color
		})

		// TODO: optimize this
		if (Math.round(scheduledHours) !== 0)
		  tag = (
		    <div
		      className = 'dateCellTag'
				   style = {{
				     background: background,
				   }}
		      >
		      { scheduledHours.toFixed(1) + 'h'}
		    </div>
		  )
		
		return (
		  <div
		    style={style}
			  onContextMenu = { e => {
			      // if the user misses slightly when attempting
			      // to remove an event the standard context menu
			      // pops up which is annoying
			      e.preventDefault()
			  }}
		    >
		    { tag }
		    { cellProps.children }
		  </div>
		)
	      },
	    }}
	  />
	</div>

	{ pickerPanel }

      </div>
    )
  }
}

export default App
