import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import Home from './Home.jsx';
import Navbar from './Navbar.jsx';
import Notifications from './Notifications.jsx';
import TicTacToe from './TicTacToe/TicTacToe.jsx';
import CreateAccount from './Auth/CreateAccount.jsx';
import Login from './Auth/Login.jsx';
import UserInfo from './Auth/UserInfo.jsx';
import ChatBox from './ChatBox/ChatBox.jsx';
import ActiveGames from './ActiveGames.jsx';
import API from './api.js';
import io from 'socket.io-client';

class App extends React.Component {
	constructor() {
		super();
		this.state = {
			page: 'home',
			activeGameType: null, //might not be necessary..
			activeGame: null, //current game being played
			activeGames: [],  //array of all games active user is involved in without win
			opponentUserData: [],
			loginUsername: null,
			loginPassword: null,
			loginErrorMessage: null,
			activeUserId: null,
			activeUsername: null,
			activeUserEmail: null,
			activeCreationDate: null,
			activeUserBio: null
		}
		this.handleNavButtonClick = this.handleNavButtonClick.bind(this);
		this.onCreateAccountClick = this.onCreateAccountClick.bind(this);
		this.loginSubmit = this.loginSubmit.bind(this);
		this.loginNewAccount = this.loginNewAccount.bind(this);
		this.loginOnChange = this.loginOnChange.bind(this);
		this.logOut = this.logOut.bind(this);
		this.returnHome = this.returnHome.bind(this);
		this.fetchUserData = this.fetchUserData.bind(this);
		// this.launchGame = this.launchGame.bind(this);
		this.joinGame = this.joinGame.bind(this);
		this.getActiveGames = this.getActiveGames.bind(this);
		this.socket = io('http://localhost:1337');

	}

	componentDidMount() {
		this.fetchUserData();
		this.getActiveGames();
	}

	fetchUserData() {
		if (localStorage.getItem('userToken')) {
			var token = localStorage.getItem('userToken');
			var userId = localStorage.getItem('userId');
			API.get('/userinfo', {
				headers: {
					userId: userId,
					Authorization: 'Bearer ' + token
				}
			})
			.then(results => {
				var userInfo = results.data;
				this.setState({
					activeUserId: userInfo.id,
					activeUsername: userInfo.username,
					activeUserEmail: userInfo.email,
					activeCreationDate: userInfo.created
					//activeUserBio: userInfo.bio
				});
			})
			.catch(error => {
				console.log('error from fetchUserData axios call: ', error.response);
			});
		}
	}

	/*
		--- Navbar functions -------------------------------------------------------------------------------
	*/
	handleNavButtonClick(e) {
		e.preventDefault();
		this.setState({
			page: e.target.name
		});
	}

	returnHome() {
		this.setState({
			page: 'home'
		});
	}
	/*
		------ Auth ------------------------------------------------------------------------------------------
	*/
	onCreateAccountClick() {
		this.setState({
			page: 'createAccount'
		});
	}

	loginOnChange(e) {
		this.setState({
			[e.target.name]: e.target.value
		});
	}

	loginSubmit(e) {
		var loginUsername = this.state.loginUsername;
		var loginPassword = this.state.loginPassword;

		API.post('/login', {
			username: loginUsername,
			password: loginPassword
		}).then(results => {
			localStorage.setItem('userToken', results.data.token);
			localStorage.setItem('userId', results.data.id);
			this.setState({
				activeUserId: results.data.id,
				activeUsername: results.data.username,
				activeUserEmail: results.data.email,
				activeCreationDate: results.data.created,
				loginUsername: null,
				loginPassword: null
			});
		})
		.then(() => {
			this.getActiveGames();
		}).catch(error => {
			console.log('error.response from login axios error: ', error.response);
			this.setState({
				loginErrorMessage: error.response.data.message
			});
		});
	}

	loginNewAccount(username, password) {
		//may need to update this to fetch games have been invited to by other users
		API.post('/login', {
			username: username,
			password: password
		}).then(results => {
			localStorage.setItem('userToken', results.data.token);
			this.setState({
				activeUsername: results.data.username,
				activeUserId: results.data.id,
				activeUserEmail: results.data.email,
				activeCreationDate: results.data.created
			});
		}).catch(error => {
			console.log('error.response from loginNewAccount axios error: ', error.response);
			this.setState({
				loginErrorMessage: error.response.data.message
			});
		});
	}

	logOut() {
		localStorage.removeItem('userToken');
		localStorage.removeItem('userId');
		this.setState({
			activeUsername: null,
			activeUserId: null,
			activeUserEmail: null,
			activeUserBio: null,
			activeCreationDate: null,
			loginErrorMessage: null,
			activeGames: []
		});
	}

	// launchGame(game) {
	// 	this.setState({
	// 		gameInSession: true,
	// 		activeGameType: game.type,
	// 		page: game.type
	// 	});
	// }

	getActiveGames() {
		//make request to database to get list of active games
		//get all games that have no winner yet
		var token = localStorage.getItem('userToken');
		var userId = localStorage.getItem('userId');
		API.get('/usersgames', {
			headers: {
				Authorization: 'Bearer ' + token
			},
			params: {
				userId: userId
			}
		})
		.then(results => {
			this.setState({
				activeGames: results.data
			});
		})
		.catch(error => {
			console.log('error from axios call to usersgames: ', error);
		});
	}

	joinGame(e) {
		e.preventDefault();
		let token = localStorage.getItem('userToken');
		let userId = localStorage.getItem('userId');
		//allow user to join game if logged in and not the same user that created the open game
		API.post('/joingame', {
			gameId: e.target.id,
			player2: userId
		}, {
			headers: {
				Authorization: 'Bearer ' + token
			}
		}).then(response => {
			//new game id
			var newGame = response.data;
			var activeGamesUpdated = this.state.activeGames.slice().concat(newGame);
			this.setState({
				activeGames: activeGamesUpdated,
				activeGameType: newGame.game.type,
				activeGame: newGame,
				page: newGame.game.type
			});
		}).catch(error => {
			console.log('error from joinGame post request: ', error);
		});
	}
	

	render() {
		var selectedPage = this.state.page;
		var displayed;
		var userSection;
		var isLoggedIn = localStorage.getItem('userToken') ? true : false;
		var activeGameSection = null;
		var activeGameSection = isLoggedIn ? <ActiveGames appState={this.state} /> : null;
		var chat = isLoggedIn ? <ChatBox socket={this.socket} activeUsername={this.state.activeUsername}/> : null;

		if (selectedPage === 'tictactoe') {
			displayed = <TicTacToe socket={this.socket} appState={this.state} returnHome={this.returnHome}/>;
		} else if (selectedPage === 'createAccount') {
			displayed = <CreateAccount loginNewAccount={this.loginNewAccount} returnHome={this.returnHome}/>
		} else if (selectedPage === 'notifications') {
			displayed = <Notifications appState={this.state} />
		} else {
			displayed = <Home joinGame={this.joinGame} appState={this.state}/>;
			//home had launchGame={this.launchGame} passed in
		}

		if (isLoggedIn) {
			userSection = <UserInfo logOut={this.logOut} username={this.state.activeUsername} created={this.state.activeCreationDate} bio={this.state.activeUserBio} />
		} else {
			userSection = <Login loginOnChange={this.loginOnChange} onCreateAccountClick={this.onCreateAccountClick} loginSubmit={this.loginSubmit} loginErrorMessage={this.state.loginErrorMessage} />
		}

		return (
			<div className="page">
				<div className="loginAndHome">
					{userSection}
					<Navbar handleNavButtonClick={this.handleNavButtonClick}/>
					<div className="displayed">
						{displayed}
					</div>
				</div>
				<div>
					{activeGameSection}
				</div>
				{chat}
			</div>
		);
	}
}

ReactDOM.render(<App />, document.getElementById("app"));
