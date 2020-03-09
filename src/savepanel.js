import React, { Component } from 'react'

import { saveBlob, loadBlob } from './storage'

class SavePanel extends Component {

  loadErrorPanel() {
    if (this.state.loadError) {
      return (
	<div>
	  
	</div>
      )
    }
  }

  render() {
    return (
      <div className = 'savePanel'>
	<a
	  href = { URL.createObjectURL(saveBlob()) }
	  download = 'schedule.json'
	>
	  <button className = 'fileButton'>Spara</button>
	</a>

	<input
	  type = 'file'
	  id = 'file'
	  className = 'inputfile'
	  accept = '.json'
	
 	  onChange = { event => {
	      event.preventDefault()
	      event.target.files[0].text()
		   .then(data => {

		     // parses from JSON to actual data
		     data = loadBlob(data)
		     this.props.insert(data)
		     this.props.closeModal()
		   })
	  }}
	
	  style = {{
	    width: '0.1px',
	    height: '0.1px',
	    opacity: '0',
	    overflow: 'hidden',
	    position: 'absolute',
	    zIndex: '-1',
	  }}
	/>
	<label
	  htmlFor = 'file'
	  className = 'fileButton clickable'
	>
	  Öppna
	</label>
	
      </div>
    )
  }

}

export default SavePanel
