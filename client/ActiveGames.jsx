import React from 'react';
import moment from 'moment';
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
		this.formatActiveGamesList = this.formatActiveGamesList.bind(this);
		this.sort = this.sort.bind(this);
		// this.filterActiveGamesList = this.filterActiveGamesList.bind(this);
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		//make api call to get all opponent data
		//var gamesToDisplay = this.filterActiveGamesList(this.props.appState.activeGames);
		var gameIdsArray = this.props.appState.activeGames.map(game => {
			return game.id;
		});
		var prevIdsArray = prevProps.appState.activeGames.map(game => {
			return game.id;
		});
		if (JSON.stringify(this.sort(gameIdsArray)) !== JSON.stringify(this.sort(prevIdsArray))) {
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
	}



	// filterActiveGamesList(games) {
	// 	let typesToDisplay = this.state.typesToDisplay;
	// 	return games.filter((game) => {
	// 		return typesToDisplay.includes(game.game.type);
	// 	});
	// }

	formatActiveGamesList(games) {
		var userId = localStorage.getItem('userId');
		return games.map(game => {
			var opponentId = userId === game.game.player1 ? game.game.player2 : game.game.player1;
			var opponentData = this.state.opponentData[opponentId];
			if (!opponentData) {
				return null;
			}
			var opponentName = opponentData.username;
			return (
				<div className="activeGameDiv" key={game.id}>
					<h5>{game.game.type} - vs. {opponentName}</h5>
					<h6>started: {moment(game.game.begin).fromNow()}</h6>
				</div>
			);
		}).filter(result => result !== null);
	}


	// chooseTypesToDisplay(e) {
	// 	this.setState({
	// 		typesToDisplay: e.target.name
	// 	});
	// }

	sort(array) {
		return array.sort((a, b) => {
			if (a < b) {
				return -1;
			} else if (a > b) {
				return 1;
			} else {
				return 0;
			}
		});
	}

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
			var opponentDataArray = results.map(result => {
				return result.data;
			});
			var opponentData = {};
			opponentDataArray.forEach(object => {
				opponentData[object.id] = object;
			});
			this.setState({
				opponentData: opponentData
			});
		})
		.catch(error => {
			console.log('error from fillOpponentDataObject', error);
		});
	}

	render() {
		var games = this.formatActiveGamesList(this.props.appState.activeGames);
	  return (
		  <div className="activeGamesDiv">
		  	<h3 className="activeGamesTitle">your active games</h3>
		  	<div className="activeGamesList">
		  	  {games}
		  	</div>
		  </div>
	  );
	}
		
}
/*
<div className="activeGamesButtons">
		 		</div>
				  <button onClick={this.chooseTypesToDisplay} name="all">all</button>
				  <button onClick={this.chooseTypesToDisplay} name="tictactoe">tic tac toe</button>
				  <button onClick={this.chooseTypesToDisplay} name="checkers">checkers</button>

*/
export default ActiveGames;