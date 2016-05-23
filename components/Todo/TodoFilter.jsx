
import React, { Component } from 'react'

export default class TodoFilter extends Component {

	renderFilter(filter, name) {
		if(filter == this.props.filter){
			return (
				<span>{name}</span>
			)
		}
		return (
			<a href="#" onClick={() => {this.props.onFilterChange(filter)}}>{name}</a>
		)
	}

	render() {
		return (
			<div className="filters">
				{this.renderFilter('SHOW_ALL', 'All')}
				{this.renderFilter('SHOW_COMPLETED', 'Completed')}
				{this.renderFilter('SHOW_ACTIVE', 'Active')}
			</div>	
		)
	}

}
