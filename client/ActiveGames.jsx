import React from 'react';
import axios from 'axios';
import API from './api.js';


class ActiveGames extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			opponentIds: [],
			opponentData: {},
			typesToDisplay: []
		}
		this.getOpponentIds = this.getOpponentIds.bind(this);
		this.getOpponentUserData = this.getOpponentUserData.bind(this);
		this.fillOpponentDataObject = this.fillOpponentDataObject.bind(this);
		// this.filterActiveGamesList = this.filterActiveGamesList.bind(this);
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		//make api call to get all opponent data
		//var gamesToDisplay = this.filterActiveGamesList(this.props.appState.activeGames);
		var gameIdsArray = this.props.appState.activeGames.map(game => {
			return game.id;
		});
		gameIdsArray.sort((a, b) => {
			if (a < b) {
				return -1;
			} else if (a > b) {
				return 1;
			} else {
				return 0;
			}
		});
		var prevIdsArray = prevProps.appState.activeGames.map(game => {
			return game.id;
		});
		prevIdsArray.sort((a, b) => {
			if (a < b) {
				return -1;
			} else if (a > b) {
				return 1;
			} else {
				return 0;
			}
		});
		if (JSON.stringify(gameIdsArray) !== JSON.stringify(prevIdsArray)) {
			this.getOpponentIds(this.fillOpponentDataObject);
		}
		// let formattedList = gamesToDisplay.map((game) => {
		// 	let opponent;
		// 	if (props.appState.activeUserId === game.game.player1) {
		// 		opponent = game.game.player2;
		// 	} else {
		// 		opponent = game.game.player1;
		// 	}
		// 	this.getOpponentUserData();


		//get all opponent user ids before map into a list. then fetch all their user data (make sure search is unique)
		//creat a map (obj) from their user id to their data
		//create promises for all their user data
		//use promise.all
		//save this right above formatted list
		// return <div id={game.id}>
		// 			   <h5>{game.game.type} - vs. {opponent}</h5>
		// 			   <h6>started: {moment(game.game.begin).fromNow()}</h6>	
		// 			 </div>
		// });
	}



	// filterActiveGamesList(games) {
	// 	let typesToDisplay = this.state.typesToDisplay;
	// 	return games.filter((game) => {
	// 		return typesToDisplay.includes(game.game.type);
	// 	});
	// }

	// formatActiveGamesList(activeGames) {

	// }


	// chooseTypesToDisplay(e) {
	// 	this.setState({
	// 		typesToDisplay: e.target.name
	// 	});
	// }

	getOpponentIds(callback) {
		var ids = [];
		var activeGames = this.props.appState.activeGames;
		activeGames.forEach(game => {
			if (game.game.player1 === this.props.appState.activeUserId) {
				if (!ids.includes(game.game.player2)) {
					ids.push(game.game.player2);
				}
			} else {
				if (!ids.includes(game.game.player1)) {
					ids.push(game.game.player1);
				}
			}
		});
		this.setState({
			opponentIds: ids
		}, callback);
	}

	getOpponentUserData(userId) {
		var token = localStorage.getItem('userToken');
		return API.get('/userinfo', {
			headers: {
				userId: userId,
				Authorization: 'Bearer ' + token
			}
		});
	}

	fillOpponentDataObject() {
		var userDataAxiosRequests = this.state.opponentIds.map(id => {
			return this.getOpponentUserData(id);
		});
		axios.all(userDataAxiosRequests)
		.then((results) => {
			var opponentData = results.map(result => {
				return result.data;
			});
			this.setState({
				opponentData: opponentData
			});
		})
		.catch(error => {
			console.log('error from fillOpponentDataObject', error.response);
		});
	}

	render() {
	  return (
		  <div className="activeGamesDiv">
		  	<h3>Active Games</h3>
			  <button onClick={this.chooseTypesToDisplay} name="all">all</button>
			  <button onClick={this.chooseTypesToDisplay} name="tictactoe">tic tac toe</button>
			  <button onClick={this.chooseTypesToDisplay} name="checkers">checkers</button>
		  </div>
	  );
	}
		
}

export default ActiveGames;