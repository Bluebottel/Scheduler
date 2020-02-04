import React, { Component } from 'react'

import './modalmenu.css'

class ModalMenu extends Component {
  constructor(props) {
    super(props)

    this.state = {
      events: this.props.events,
      resources: this.props.resources,
      shifts: this.props.shifts,
    }

  }


  render() {
    return (
      <React.Fragment>
	<div className = "boxLabel">Resurser</div>
	<div className = "pickerBox">
	  [Resurslista]
	</div>
	<div className = "boxLabel">Pass</div>
	<div className = "pickerBox">
	  [Passlista]
	</div>
	<div className = "boxLabel">FTP</div>
	<div className = "pickerBox">
	  [FTPstuff]
	</div>
      </React.Fragment>
    )
  }
}

export default ModalMenu
