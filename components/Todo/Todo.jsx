
import React, { Component } from 'react'

export default class Todo extends Component {

	render() {
		return (
			<div onClick={this.props.toggleClick} className=
				{this.props.completed ? 'completed' : 'uncompleted'}>
				{this.props.text}
			</div>
		)
	}

}