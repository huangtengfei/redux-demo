
import { createStore } from 'redux'

import todoApp from './reducers.js'

import { addTodo, toggleTodo, setFilter, Filters } from './actions.js'

let store = createStore(todoApp)

let unsubscribe = store.subscribe(() => {
	console.log(store.getState())
})

store.dispatch(addTodo('build a react app'))
store.dispatch(addTodo('build a redux app'))
store.dispatch(toggleTodo(1))
store.dispatch(setFilter(Filters.SHOW_ACTIVE))

unsubscribe();
store.dispatch(addTodo('build a todo app'))