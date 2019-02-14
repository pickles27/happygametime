import React from 'react';
import axios from 'axios';
import moment from 'moment';

class Home extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			openGames: [],
			newOpenGameView: false,
			gameSelection: '-'
		}

		this.showNewOpenGameField = this.showNewOpenGameField.bind(this);
		this.hideNewOpenGameField = this.hideNewOpenGameField.bind(this);
		this.postNewGame = this.postNewGame.bind(this);
		this.getOpenGames = this.getOpenGames.bind(this);
		this.newOpenGame = this.newOpenGame.bind(this);
		this.onChange = this.onChange.bind(this);
		this.formatOpenGamesData = this.formatOpenGamesData.bind(this);
		this.sortByDate = this.sortByDate.bind(this);
		this.joinGame = this.joinGame.bind(this);

	}

	componentDidMount() {
		this.getOpenGames()
		.then(openGamesResults => {
			this.setState({
				openGames: openGamesResults.data
			});
		})
		.catch(error => {
			console.log('error from componentDidMount: ', error);
		});
	}

	showNewOpenGameField() {
		this.setState({
			newOpenGameView: true
		});
	}

	hideNewOpenGameField() {
		this.setState({
			newOpenGameView: false
		});
	}

	postNewGame() {
		var token = localStorage.getItem('userToken');
		return axios.post('/newopengame', {
				creatorId: this.props.appState.activeUserId,
				creatorUsername: this.props.appState.activeUsername,
				gameType: this.state.gameSelection
			},
			{
				headers: {
					Authorization: 'Bearer ' + token	
				}
			});
	}

	getOpenGames() {
		return axios.get('/opengames');
	}

	newOpenGame(e) {
		e.preventDefault();
		this.postNewGame()
			.then(newGameResults => {
				return this.getOpenGames();
			}).then(openGamesResults => {
				this.setState({
					openGames: openGamesResults.data
				});	
			}).then(() => {
				this.hideNewOpenGameField();
			}).then(() => {
				this.formatOpenGamesData(this.state.openGames);
		  }).catch(error => {
			  console.log('error from newopengame post: ', error.response);
		  });
	}

	onChange(e) {
		this.setState({
			[e.target.name]: e.target.value
		});
	}

	sortByDate(games) {
		return games.sort(function(a, b) {
			return new Date(b.timestamp) - new Date(a.timestamp);
		});
	}

	formatOpenGamesData(games) {
		var sortedGames = this.sortByDate(games);
		return sortedGames.map(game => {
			return (
				<div className="openGameInfo">
					<p className="openGameTypeAndFoe">{game.gametype} - created by {game.creatorusername}</p>
					<p className="openGameTimestamp">{moment(game.timestamp).fromNow()}</p>
					<button className="joinGameButton" id={game.id} onClick={this.joinGame}>join</button>
				</div>
			);
		});
	}

	joinGame(e) {
		e.preventDefault();
		let token = localStorage.getItem('userToken');
		//allow user to join game if logged in and not the same user that created the open game
		axios.post('/joingame', {
			gameId: e.target.id,
			player2: this.props.appState.activeUserId
		}, {
			headers: {
				Authorization: 'Bearer ' + token
			}
		})
		.then(response => {
			//new game id
			console.log('response from joinGame post request: ', response);
			
		})
		.catch(error => {
			console.log('error from joinGame post request: ', error.response);
		})
	}

	render() {
		let gameList;
		if (this.state.openGames.length > 0) {
			gameList = this.formatOpenGamesData(this.state.openGames);
		} else {
			gameList = <div>
									<h6>there are no open games :(</h6>
								 </div>;
		}
		let newOpenGameView;
		if (this.state.newOpenGameView) {
			newOpenGameView = <div className="newOpenGameViewDiv">
													<h4>game:</h4>
													<select name="gameSelection" value={this.state.gameSelection} onChange={this.onChange}>
														<option value="-">-</option>
														<option value="tictactoe">tic tac toe</option>
													</select>
												  <button onClick={this.newOpenGame} name="newgamesubmit">create game</button>
												</div>;
		} else {
			newOpenGameView = <div>
													<button onClick={this.showNewOpenGameField}>create open game</button>
												</div>;
		}

		return (
			<div className="homePage">
				<h1 className="happyGameTimeTitle">happy game time</h1>
				{newOpenGameView}
				<div className="newOpenGameDiv">
					<h3>open games:</h3>
					{gameList}
				</div>
			</div>
		);
	}
}

export default Home;