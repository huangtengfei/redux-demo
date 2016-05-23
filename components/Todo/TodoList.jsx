
import React, { Component } from 'react'

import Todo from './Todo.jsx'

export default class TodoList extends Component {

	render() {
		let todos = this.props.todos.map((todo, i) => {
			return (
				<Todo {...todo} key={i} toggleClick={() => this.props.onToggleClick(i)} />
			)
		})
		return (
			<div className="todo-list">
				{todos}
			</div>
		)
	}

}