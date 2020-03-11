import React, { Component } from 'react'

import ColorPicker from 'rc-color-picker'
import InlineConfirmButton from 'react-inline-confirm'
import EasyEdit from 'react-easy-edit'

import { rulesMap, updateCondition } from './rulestore'

import trashcan from './img/trashcan.png'

class RulesPanel extends Component {
  constructor(props) {
    super(props)

    let rules = []
    for (let entry of rulesMap.keys())
      rules.push(entry)
    
    this.state = {
      rulesList: rules,
    }
  }

  renderOptions = list => {
    let results = []
    list.forEach((ruleText, i) => {
	results.push((
	  <option
	    key = { i }
	    value = { ruleText }
	  >
	    { ruleText }
	  </option>
	))
    })
      
    return results
  }

  render() {
    if (!this.props.rules) return ''

    return (
      <div className = 'rulesPanel'>
	{
	  this.props.rules.map(({ text, color , value }, i) => {
	    return (
	      <div key = { i }>
		<select
		  value = { text }
		  onChange = { event => {
		      let newRules = this.props.rules
		      newRules[i].text = event.target.value
		      newRules[i] = updateCondition(newRules[i])
		      this.props.setRules(newRules)
		  }}
		>
		  { this.renderOptions(this.state.rulesList)}
		</select>

		<EasyEdit
		  type = 'number'
		  value = { parseFloat(value).toFixed(1) }
		  onSave = {
		    newValue => {
		      let newRules = this.props.rules
		      newRules[i].value = newValue
		      this.props.setRules(newRules)
		    }
		  }
		  onValidate = {
		    value => !isNaN(parseFloat(value))
			&& parseFloat(value).toFixed(1) >= 0.0
		  }
	 	  validationMessage = 'Måste vara en siffra >= 0'
	      	  saveButtonLabel = 'Spara'
		  cancelButtonLabel = 'Avbryt'
		  onHoverCssClass = 'clickable'
		/>

		<ColorPicker
		  animation = 'slide-up'
		  color = { color }
		  onClose = { argColor => {
		      console.log('argcolor: ', argColor)
		      let newRules = this.props.rules
		      newRules[i].color = argColor.color
		      this.props.setRules(newRules)
		  }}
		  enableAlpha = { false }
		/>

		<InlineConfirmButton
		  className = "confirmButton"
		  textValues = {['', 'Ta bort?', '']}
		  onClick = { () => {
		      let newRules = this.props.rules
		      newRules.splice(i, 1)
		      this.props.setRules(newRules)
		  }}
		  showTimer
		  isExecuting = { false }
		>
		  <img
		    src = { trashcan }
		    alt = "[Delete]"
		    className = "clickable"
		    style = {{
		      height: '17px'
		    }}
		  />
		  
		</InlineConfirmButton>
	      </div>
	    )
	    
	  })
	}

      </div>
    )
  }
}

export default RulesPanel
