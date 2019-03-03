import React from 'react';

class Notifications extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			newInvites: [],
			outgoingInvites: [],
			
		}
		this.onChange = this.onChange.bind(this);
	}

	onChange(e) {
    this.setState({
      [e.target.name]: e.target.value 
    });
  }

	getMyInvites() {
		//axios call to db
	}

	getMyOutgoingInvites() {
		//axios call to db
	}

	sendNewInvite() {
		//recipientUsername
	}

	render() {
		return (
			<div className="invitesPage">
				<h1>personal game invitations</h1>
				<div>
					<h5>you have no game invitations :(</h5>
				</div>
				<div className="inviteArea">
					<h3 className="inviteInviteAFriend">invite a friend! enter their email or username:</h3>
					<input className="inviteInput" type="text" name="recipientUsername" placeholder="username (must have an account)" onChange={this.onChange} />
					<h5 className="inviteOR">OR</h5>
					<input className="inviteInput" type="email" name="recipientEmail" placeholder="email address" onChange={this.onChange} />
					<textarea className="inviteInput" rows="4" columns="50" name="customMessage" placeholder="enter a custom message (up to 200 characters): " onChange={this.onChange}></textarea>
					<button className="invitesSubmitButton">submit</button>
				</div>
			</div>
		);
	}
}

export default Notifications;