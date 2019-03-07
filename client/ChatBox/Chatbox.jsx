import React from 'react';
import io from 'socket.io-client';

class ChatBox extends React.Component {
	constructor() {
		super();
		this.state = {
			messages: [
									{ user: 'dart', message: 'give me food!'},
									{ user: 'maddie', message: 'i like climbing on stuff'}
								],
			input: null
		}
		this.onChange = this.onChange.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
	}

	componentDidMount() {
		//open connection
	}

	componentWillUnmount() {
		//close connection
	}

	onChange(event) {
		this.setState({
			[event.target.name]: event.target.value
		});
	}

	onSubmit(event) {
		event.preventDefault();
		//submit input message
	}

	render() {
		var messages = this.state.messages.map(message => {
			return (
				<li>
					{message.user}: {message.message}
				</li>
			);
		});
		return (
			<div>
				<h3>local chat</h3>
				<ul>
					{messages}
				</ul>
				<input type="text" name="input" onChange={this.onChange} />
				<button onClick={this.onSubmit}>send</button>
			</div>
		);
	}
}

export default ChatBox;