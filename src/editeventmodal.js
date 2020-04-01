import React, { Component } from 'react'
import moment from 'moment'
import Autocomplete from 'react-autocomplete'

import ColorPicker from 'rc-color-picker'
import 'rc-color-picker/assets/index.css'

import InputMoment from 'input-moment'
import 'input-moment/dist/input-moment.css'

import { timePad } from './utilities'

import './editeventmodal.css'


class EditEventModal extends Component {
  constructor(props) {
    super(props)

    const color = this.props.event.color === undefined ?
		  this.randomColor() : this.props.event.color

    // in case a completely new event is being made
    let title, titleValue
    if (this.props.event.title === undefined &&
	this.props.event.customTitle === undefined) {
      title = 'Title'
      titleValue = ''
    }
    
    else {
      title = this.props.event.title !== undefined ?
	      this.props.event.title : this.props.event.customTitle
      titleValue = title
    }

    this.state = {
      eventColor: color,
      start: this.props.event.start,
      end: this.props.event.end,
      customTitle: titleValue,
      previousTitle: title,

      /* start and end choosing: true while the user is picking 
	 a start or stop date for the event */
      startChoosing: false,
      endChoosing: false,
    }
    
  }

  componentDidMount() {
    this.titleInput.focus()
    document.addEventListener("keydown", this.onTab, false);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.onTab, false);
  }

  onTab = event => {
    // fill in the text from the auto complete
    if (event.key === 'Tab') {
      event.preventDefault()
      console.log('pressed tab! ', event)
    }
    
  }

  randomColor = () => { return "#"+((1<<24)*Math
    .random()|0).toString(16) }

  generalErrorPanel = type => {
    if (this.state[type] === undefined)
      return ''

    else return (
      <div
	style = {{
	  textAlign: 'center',
	  margin: '0px 0px 6px',
	  background: '#ffa5a5',
	  padding: '4px 0 4px 0',
	}}
      >
	{ this.state[type] }
      </div>
    )
  }

  // target = "start" | "end"
  dateTimePicker = ({ trigger, target }) => {

    let dt = this.state[target]

    if (!trigger)
      return (
	  <div
	    className = 'clickable'
	    onClick = { () => {
		this.setState({
		  [`${target}Choosing`]: true,
		})
	    }}
	  >
	    {
	      dt.getFullYear() + '-' +
	      timePad(dt.getMonth()+1) +  '-' +
	      timePad(dt.getDate()) + ' ' +
	      timePad(dt.getHours()) + ':' +
	      timePad(dt.getMinutes())
	    }
	  </div>
      )

    else return (
      <InputMoment
	mindate = { new Date() }
	moment = { moment(this.state[target]) }
	onSave = { () => {
	    this.setState({
	      [`${target}Choosing`]: false,
	      dateError: undefined,
	    })	    
	}}
	onChange = { newMoment => {
	    if (target === 'start' && newMoment.isAfter(this.state.end)) {
	      this.setState({
		dateError: 'Händelsen måste börja innan den slutar',
	      })
	      return
	    }

	    if (target === 'end' && newMoment.isBefore(this.state.start) ) {
	      this.setState({
		dateError: 'Händelsen får inte sluta innan den börjar',
	      })
	      return
	    }

	    this.setState({
	      [target]: newMoment.toDate(),
	      dateError: undefined,
	    })  
	}}
	minStep = { 5 }
	hourStep = { 1 }
	prevMonthIcon = "ion-ios-arrow-left"
	nextMonthIcon = "ion-ios-arrow-right"
      />
    )
  }

  optionsTable = () => {

    if (this.state.startChoosing || this.state.endChoosing) {
      const target = this.state.startChoosing ? 'start' : 'end'
  
      return (
	<React.Fragment>
	  <div
	    style = {{
	      width: '100%',
	      textAlign: 'center',
	  }}>
	    <b>{ target === 'start' ? 'Börjar' : 'Slutar' }</b>
	  </div>
	  
	  { this.generalErrorPanel('dateError') }
	  
	  {
	    this.dateTimePicker({
	      trigger: true,
	      target: target,
	    })
	  }
	</React.Fragment>
      )
    }
    
    return (
      <div
	style = {{
	  display: 'grid',
	  gridTemplateColumns: '1fr 3fr',
	  gridRowGap: '0.5vh',
	  margin: '0.5vh 0 0.5vh 0',
	}}
      >
	<div>Färg</div>
	<ColorPicker
	  enableAlpha = { false }
	  animation = 'slide-up'
	  color = { this.state.eventColor }
	  onClose = { choice => {
	      this.setState({
		eventColor: choice.color
	      })
	  }}
	/>

	<div
	  style = {{
	    gridColumn: 'span 2',
	  }}
	>
	  <Autocomplete
	    getItemValue = { item => item.title  }
	    items = { this.props.resources }
	    value = { this.state.autoCompleteValue }
	    onChange = { e => this.setState({ autoCompleteValue: e.target.value }) }
	    onSelect = { value => { this.setState({autoCompleteValue: value })} }
	    shouldItemRender = { (item, value) => item.title.toLowerCase().includes(value) /* TODO: check for custom event */}
	    renderItem = { (item, highlighted) => 
	      <div style = {{ background: '#ddd' }}>
		{ item.title }
	      </div>
	    }
	  />
	  
	</div>

	<div>Börjar</div>
	{
	  this.dateTimePicker({
	    trigger: this.state.startChoosing,
	    target: 'start'
	  })
	}

	<div>Slutar</div>

	{
	  this.dateTimePicker({
	    trigger: this.state.endChoosing,
	    target: 'end'
	  })
	}
	
	
      </div>
    )
  }

  buttonsPanel = () => {
    return (
      <div
	style = {{
	  display: "flex",
	  justifyContent: "space-between",
	  marginBottom: '-3px',
	}}>
	<input
	type = "submit"
	value = "Spara"
	style = {{
	  borderRadius: '0px 0px 0px 5px',
	}}
	/>
	<button
	  onClick = { this.props.closeModal }
	  style = {{
	    borderRadius: '0px 0px 5px 0px',
	  }}
	>
	  Avbryt
	</button>
      </div>
    )
  }

  render() {
    if (this.state.startChoosing || this.state.endChoosing)
      return (
	<React.Fragment>
	{ this.generalErrorPanel('dateError') }
	{
	  this.dateTimePicker({
	    trigger: true,
	    target: this.state.startChoosing ? 'start' : 'end',
	  })
	}
	</React.Fragment>
      )
    
    return (
      <form
	onSubmit = { ev => {
	  ev.preventDefault()
	    if (!this.state.customTitle || this.state.customTitle.length === 0) {

	      this.setState({
		titleError: 'Titeln får inte vara tom',
	      })
	      return
	    }

	    // making a new event
	    if (this.props.event.id !== undefined) {
	      this.props.editEvent({
		id: this.props.event.id,
		customTitle: this.state.customTitle,
		start: this.state.start,
		end: this.state.end,
		color: this.state.eventColor,
		resourceId: undefined,
		shiftId: undefined,
	      })
	      this.props.closeModal()
	    }

	    // editing an existing one
	    else { 
	      this.props.addEvent({
		customTitle: this.state.customTitle,
		start: this.state.start,
		end: this.state.end,
		color: this.state.eventColor,
	      })
	      this.props.closeModal()
	    }
	}}
	>
	
	<div style = {{
	  textAlign: "center",
	  fontWeight: "bold",
	  margin: '-8px 0px 6px 0px',
	}}
	>
	  { this.props.event.id === undefined ? 'Ny händelse' : 'Redigera händelse' }
	</div>

	<input
	  ref = { instance => this.titleInput = instance }
	  type = "text"
	  placeholder = { this.state.previousTitle }
	  value = { this.state.customTitle}
	  onChange = { event => {
	      let newError = undefined
	      if (event.target.value.length === 0)
		newError = this.state.titleError

	      this.setState({
		customTitle: event.target.value,
		titleError: newError,
	      })
	  }}
	  style = {{ padding: '4px' }}
	>
	</input>

	{ this.generalErrorPanel('titleError') }
	{ this.optionsTable() }
	{ this.buttonsPanel() }
      </form>
    )
  }
}

export default EditEventModal
