import React from 'react';
import moment from 'moment';

var UserInfo = (props) => {
	let userBio;
	if (props.bio) {
		userBio = props.bio;
	}
	return (
		<div className="userInfoBox">
			<h3>{props.username}</h3>
			<h6>member since {moment(props.created).format("MMM Do YYYY")}!</h6>
			{userBio}
			<button className="editBioButton">Edit bio</button>
			<button className="logOutButton" onClick={props.logOut}>Log out</button>
		</div>
	);
}

export default UserInfo;