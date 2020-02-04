import React, { Component } from 'react'

class ModalMenu extends Component {
  constructor(props) {
    super(props)

    this.state = {
      
    }

  }


  render() {
    return (
      <div className = "modalContainer">
	<div className = "pickerBox">
	  Resurser
	</div>
	<div className = "pickerBox">
	  Pass
	</div>
	<div className = "FTP">
	  FTP
	</div>
      </div>
    )
  }
}

export default ModalMenu
