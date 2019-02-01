import React from 'react';

class Invites extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			activeUserId: this.props.activeUserId,
			newInvites: [],
			outgoingInvites: []
		}
	}

	getMyInvites() {
		//axios call to db
	}

	getMyOutgoingInvites() {
		//axios call to db
	}

	render() {
		return (
			<div>
				<h1>Invites page!!!!!</h1>
				<div>
					<h3>Your invitations:</h3>
				</div>
				<div>
					<h3>Invite a friend:</h3>
				</div>
			</div>
		);
	}
}

export default Invites;