
import React from 'react'
import { render } from 'react-dom'
import { createStore } from 'redux'
import { Provider } from 'react-redux'

import todoApp from './reducers.js'
import App from './App.jsx'

let store = createStore(todoApp)

render(
	<Provider store={store}>
		<App />
	</Provider>,
	document.getElementById('todo')
)