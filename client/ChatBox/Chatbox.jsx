import React from 'react';

class ChatBox extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			message: '',
			messages: []
			}
		
		this.onChange = this.onChange.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
	}

	componentDidMount() {
		this.props.socket.on('chat message', (message) => {
			console.log('message received: ', message);
			this.setState({
				messages: this.state.messages.concat({ user: message.user, message: message.message })
			});
		});
	}

	componentWillUnmount() {
		//close connection
	}

	onChange(event) {
		this.setState({
			message: event.target.value
		});
	}

	onSubmit(event) {
		event.preventDefault();
		//submit input message
		//add to state?
		this.props.socket.emit('chat message', { user: this.props.activeUsername, message: this.state.message});
		this.setState({
			message: ''
		});
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
			<div className="chatbox">
				<h3>local chat</h3>
				<ul>
					{messages}
				</ul>
				<div className="chatInput">
				<input type="text" name="message" value={this.state.message} onChange={this.onChange} />
				<button onClick={this.onSubmit}>send</button>
				</div>
			</div>
		);
	}
}

export default ChatBox;