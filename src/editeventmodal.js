import React, { Component } from 'react'
import moment from 'moment'
import update from 'immutability-helper'
import AutoSuggest from 'react-autosuggest'

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

    const eventResources = !this.props.event.resources ? []
			 : this.props.event.resources

    this.state = {
      eventColor: color,
      start: this.props.event.start,
      end: this.props.event.end,
      customTitle: titleValue,
      previousTitle: title,
      eventResources: eventResources,

      /* start and end choosing: true while the user is picking 
	 a start or stop date for the event */
      startChoosing: false,
      endChoosing: false,

      autocompleteValue: '',
      suggestions: [],
    }
    
  }

  componentDidMount() {
    this.titleInput.focus()
    document.addEventListener("keydown", this.onKeypress, false);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.onKeypress, false);
  }

  onKeypress = event => {
    
    if (event.key === 'Enter') {
      event.preventDefault()
      console.log('enter!', this.state.suggestions)

      if (this.state.suggestions.length === 1) {
	this.setState({
	  eventResources: update(this.state.eventResources,
				 {$push: [ this.state.suggestions[0] ]}),
	  autocompleteValue: '',
	  suggestions: [],
	})
      }
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

  resourcePanel = () => {
    if (this.state.eventResources.length === 0) return '' 

    else return (
      <div className = 'resourcePanel'>
	{
	  this.state.eventResources.map((res, i) => {
	    return (
	      <div
		className = 'resourceTag clickable'
		style = {{ background: res.color, }}
		onClick = { () => {
		    
		    // remove the resource from the event when the
		    // tag is clicked on
		    let newEventResourcesList = this
		      .state.eventResources.filter(ele => ele.id !== res.id)

		    this.setState({
		      eventResources: newEventResourcesList,
		    })
		    
		}}
		key = { i }
		>
		{ res.title }
	      </div>
	    )
	  })
	}
      </div>
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
	  <AutoSuggest
	    suggestions = { this.state.suggestions }
	  
	    onSuggestionsFetchRequested = { ({ value }) => {
		value = value.trim().toLowerCase()

		// includes is generous and doesn't care if the
		// matching part is in the beginning or not
		let newSuggestions = this.props.resources.filter(res => {
		  return res.title.toLowerCase().includes(value)
		})

		// remove all the already added resources from the suggestions
		newSuggestions = newSuggestions.filter(res => {
		  return !this.state.eventResources.find(ele => ele.id === res.id)
		})

		this.setState({
		  suggestions: newSuggestions,
		})
	    }}
	  
	    onSuggestionsClearRequested = { () => this.setState({
		suggestions: [],
	    })}
	  
	    getSuggestionValue = { resource => resource.title }
	  
	    renderSuggestion = { resource => {
		
		let highlight = ''
		if (resource.id === this.state.highlightedSuggestion?.id) {
		  highlight = ' suggestionHighlight'
		}
		return (
		  <div className = {`suggestion clickable ${highlight}`}>
		    { resource.title }
		  </div>
		)
	    }}
	  
	    inputProps = {{
	      onChange: (value, { newValue }) => {
		this.setState({ autocompleteValue: newValue })
	      },
	      value: this.state.autocompleteValue,
	      placeholder: 'Välj resurser',
	    }}
	  
	    shouldRenderSuggestions = { () => true }

	    onSuggestionSelected = { (event, { suggestion }) => {

		//eventResources.push(suggestion)
		this.setState({

		  // clear the searchbox when a tag is added
		  autocompleteValue: '',
		  suggestions: [],
		  eventResources: update(this.state.eventResources,
					 {$push: [ suggestion ]}),
		})
	    }}
	  
	    onSuggestionHighlighted = { trigger => {

		// keep track of what is highlighted so it can
		// be styled differently
		this.setState({
		  highlightedSuggestion: trigger.suggestion,
		})
	    }}
	  />
	  
	</div>

	{ this.resourcePanel() }

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
