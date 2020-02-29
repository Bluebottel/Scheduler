import React, { Component } from 'react'

import { saveBlob, loadBlob } from './storage'

class SavePanel extends Component {

  render() {
    return (
      <div className = 'savePanel'>
	<a
	  href = { URL.createObjectURL(saveBlob()) }
	  download = 'schedule.json'
	>
	  <button>Spara</button>
	</a>

	<input
	  type = 'file'
	  id = 'file'
	  className = 'inputfile'
	  accept = '.json'
	
 	  onChange = { event => {
	      event.preventDefault()
	      event.target.files[0].text()
		   .then(msg => {
		     console.log(JSON.parse(msg))
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
