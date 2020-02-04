import React, { Component } from 'react'

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
	<div className = "pickerBox">
	  Resurser
	</div>
	<div className = "pickerBox">
	  Pass
	</div>
	<div className = "FTP">
	  FTP
	</div>
      </React.Fragment>
    )
  }
}

export default ModalMenu
