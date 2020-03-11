import React, { Component } from 'react'

import { saveBlob, loadBlob } from './storage'

class SavePanel extends Component {

  loadErrorPanel() {
    if (this.props.loadingError !== undefined) {
      return (
	<div
	  style = {{
	    background: '#ffa5a5',
	    borderRadius: '2px',
	    border: '1px solid #ff7a7a',
	    padding: '2px',
	  }}>
	  { this.props.loadingError.message }
	  { this.props.loadingError.error }
	</div>
      )
    }
  }

  render() {
    return (
      <div className = 'savePanel'>
	{ this.loadErrorPanel() }
	<a
	  href = { URL.createObjectURL(saveBlob()) }
	  download = 'schedule.json'
	>
	  <button
	    className = 'fileButton'
	    style = {{
	      width: '100%',
	    }}
	  >
	    Spara till fil
	  </button>
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

		     try {
		     // parses from JSON to actual data
		       data = loadBlob(data)
		     }
		     catch (error) {
		       this.props.setLoadingError('Filen är trasig eller tom', error)
		       return
		     }

		     // in case the user is trying to load a broken or empty file
		     if (!data) {
		       this.props.setLoadingError('Filen är trasig eller tom')
		       return
		     }
		     
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
	  Öppna fil
	</label>
	
      </div>
    )
  }

}

export default SavePanel
