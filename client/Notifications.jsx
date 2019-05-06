import React from 'react';
import API from './api.js';

class Notifications extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			// newInvites: [],
			// outgoingInvites: [],
			notifications: []
			
		}
		// this.onChange = this.onChange.bind(this);
		this.getNotifications = this.getNotifications.bind(this);
	}

	componentDidMount() {
		this.getNotifications();
	}

	getNotifications() {
		var userId = localStorage.getItem('userId');
		var token = localStorage.getItem('userToken');
		API.get('/notifications', {
			headers: {
				Authorization: 'Bearer ' + token
			},
			params: {
				userId: userId
			}
		}).then(results => {
			this.setState({
				notifications: results.data.rows
			});
		}).catch(error => {
			console.log('error from getNotifications axios request: ', error.response);
		});
	}

	// onChange(e) {
 //    this.setState({
 //      [e.target.name]: e.target.value 
 //    });
 //  }

	// getMyInvites() {
	// 	//axios call to db
	// }

	// getMyOutgoingInvites() {
	// 	//axios call to db
	// }

	// sendNewInvite() {
	// 	//recipientUsername
	// }

	render() {
		var notificationsList = this.state.notifications;
		var toDisplay;
		if (notificationsList.length) {
			toDisplay = notificationsList.map(notification => {
				var body;
				if (notification.type === 'userJoinedGame') {
					//make this say the game type also!
					body = <p>{notification.sender} joined your game!</p>;
				} else if (notification.type === 'gameInvite') {
					body = <p>{notification.sender} invited you to a game!</p>;
				} else {
					body = <p>something weird happened ;(</p>;
				}
				return <div className="notifDiv" key={notification.notificationid}>
								{body}
								<button>play now!</button>
							</div>;
			});
		} else {
			toDisplay = <h5>you have no notifications, loser :(</h5>;
		}
		return (
			<div className="invitesPage">
				<h1>personal game invitations</h1>
				<div>
					{toDisplay}
				</div>

			</div>
		);
	}
}

/*
				<div className="inviteArea">
					<h3 className="inviteInviteAFriend">invite a friend! enter their email or username:</h3>
					<input className="inviteInput" type="text" name="recipientUsername" placeholder="username (must have an account)" onChange={this.onChange} />
					<h5 className="inviteOR">OR</h5>
					<input className="inviteInput" type="email" name="recipientEmail" placeholder="email address" onChange={this.onChange} />
					<textarea className="inviteInput" rows="4" columns="50" name="customMessage" placeholder="enter a custom message (up to 200 characters): " onChange={this.onChange}></textarea>
					<button className="invitesSubmitButton">submit</button>
				</div>
*/

export default Notifications;