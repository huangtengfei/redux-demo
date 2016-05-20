
import { combineReducers } from 'redux'

import { ADD_TODO, TOGGLE_TODO, SET_FILTER, Filters } from './actions.js'

const { SHOW_ALL } = Filters

function todos(state = [], action) {
	switch(action.type){
		case ADD_TODO:
			return [
				...state,
				{
					text: action.text,
					completed: false
				}
			]
		case TOGGLE_TODO:
			return state.map((todo, index) => {
				if(index == action.index){
					return Object.assign({}, todo, {
						completed: !todo.completed
					})
				}
				return todo
			})
		default:
			return state
	}
}

function filter(state = SHOW_ALL, action) {
	switch(action.type){
		case SET_FILTER:
			return action.filter
		default:
			return state
	}
}

const todoApp = combineReducers({
	todos,
	filter
})

export default todoApp