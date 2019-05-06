import React from 'react';
import moment from 'moment';

var UserInfo = (props) => {
	let userBio;
	if (props.bio) {
		userBio = props.bio;
	}
	return (
		<div className="userInfoBox">
			<h3 className="userInfoHeader">{props.username}</h3>
			<h6 className="memberSince">member since {moment(props.created).format("MMM Do YYYY")}!</h6>
			{userBio}
			<button className="userInfoButtons">Edit bio</button>
			<button className="userInfoButtons" onClick={props.logOut}>Log out</button>
		</div>
	);
}

export default UserInfo;