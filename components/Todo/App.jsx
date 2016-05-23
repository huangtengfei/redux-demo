
import React, { Component } from 'react'
import ReactDOM from 'react-dom'

import AddTodo from './AddTodo.jsx'
import TodoList from './TodoList.jsx'
import TodoFilter from './TodoFilter.jsx'

class App extends Component {

	constructor() {
		super()
		this.onAddClick = this.onAddClick.bind(this)
		this.onToggleClick = this.onToggleClick.bind(this)
		this.onFilterChange = this.onFilterChange.bind(this)

		this.state = {};
		this.state.todos = [{
			text: 'learn about react',
			completed: true
		},{
			text: 'learn redux',
			completed: false
		}]
		this.state.filter = 'SHOW_ALL'

		this.filteredTodos = this.state.todos
	}

	onAddClick(input) {
		let newTodo = {
			text: input,
			completed: false
		}
		let todos = this.state.todos
		let newTodos = todos.concat([newTodo])
		this.setState({todos: newTodos})
		this.filterTodos(newTodos, this.state.filter)
	}

	onToggleClick(index) {
		let todos = this.state.todos
		let newTodos = [...todos]
		newTodos[index].completed = !newTodos[index].completed
		this.setState({todos: newTodos})
	}

	onFilterChange(filter) {
		this.setState({filter: filter})
		this.filterTodos(this.state.todos, filter)
	}

	filterTodos(todos, filter) {
		this.filteredTodos = todos;
		if(filter == 'SHOW_COMPLETED') {
			this.filteredTodos = todos.filter((todo) => {
				return todo.completed
			})
		}else if(filter == 'SHOW_ACTIVE') {
			this.filteredTodos = todos.filter((todo) => {
				return !todo.completed
			})
		}		
	}

	render() {
		return (
			<div>
				<AddTodo onAddClick={this.onAddClick} />
				<TodoList todos={this.filteredTodos} onToggleClick={this.onToggleClick} />
				<TodoFilter filter={this.state.filter} onFilterChange={this.onFilterChange} />
			</div>	 
		)
	}

}

ReactDOM.render(<App />, document.getElementById('todo'))

