
import React, { Component } from 'react';

export default class AddTodo extends Component {

	constructor() {
		super()
		this.handleClick = this.handleClick.bind(this)
	}

	handleClick() {
		let input = this.refs.input.value.trim()
		if(!input) {
			return
		}
		this.props.onAddClick(input)
		this.refs.input.value = ''
	}

	render() {
		return (
			<div>
				<input type="text" ref="input" />
				<button onClick={this.handleClick}>Add</button>
			</div>
		)
	}

}


