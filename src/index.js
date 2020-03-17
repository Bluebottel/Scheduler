import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import * as serviceWorker from './serviceworker'

ReactDOM.render(<App />, document.getElementById('root'))

serviceWorker.register()
