import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import Home from './Home.jsx';
import Navbar from './Navbar.jsx';
import Invites from './Invites.jsx';
import TicTacToe from './TicTacToe/TicTacToe.jsx';
import CreateAccount from './Auth/CreateAccount.jsx';
import Login from './Auth/Login.jsx';
import UserInfo from './Auth/UserInfo.jsx';
import Chatbox from './Chatbox/Chatbox.jsx';

class App extends React.Component {
	constructor() {
		super();
		this.state = {
			page: 'home',
			gameInSession: false,
			activeGameType: null,
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
		this.launchGame = this.launchGame.bind(this);
	}

	componentDidMount() {
		this.fetchUserData();
	}

	fetchUserData() {
		if (localStorage.getItem('userToken')) {
			var token = localStorage.getItem('userToken');
			var userId = localStorage.getItem('userId');
			axios.get('/userinfo', {
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

		axios.post('/login', {
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
		}).then(() => {
			axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('userToken');
		}).catch(error => {
			console.log('error.response from login axios error: ', error.response);
			this.setState({
				loginErrorMessage: error.response.data.message
			});
		});
	}

	loginNewAccount(username, password) {
		//change this to send axios call to /login route
		axios.post('/login', {
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
		}).then(() => {
			axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('userToken');
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
			loginErrorMessage: null
		});
	}

	launchGame(game) {
		this.setState({
			gameInSession: true,
			activeGameType: game.type,
			page: game.type
		});
	}
	

	render() {
		var selectedPage = this.state.page;
		var displayed;
		var userSection;
		var isLoggedIn = localStorage.getItem('userToken') ? true : false;

		if (selectedPage === 'tictactoe') {
			displayed = <TicTacToe appState={this.state} returnHome={this.returnHome}/>;
		} else if (selectedPage === 'createAccount') {
			displayed = <CreateAccount loginNewAccount={this.loginNewAccount} returnHome={this.returnHome}/>
		} else if (selectedPage === 'invites') {
			displayed = <Invites appState={this.state} />
		} else {
			displayed = <Home launchGame={this.launchGame} appState={this.state}/>;
		}

		if (isLoggedIn) {
			userSection = <UserInfo logOut={this.logOut} username={this.state.activeUsername} created={this.state.activeCreationDate} bio={this.state.activeUserBio} />
		} else {
			userSection = <Login loginOnChange={this.loginOnChange} onCreateAccountClick={this.onCreateAccountClick} loginSubmit={this.loginSubmit} loginErrorMessage={this.state.loginErrorMessage} />
		}

		return (
			<div className="page">
				<div className="loginAndHome">
					<div className="loginArea">
						{userSection}
					</div>
					<div className="homeSection">
						<Navbar handleNavButtonClick={this.handleNavButtonClick}/>
						<div className="displayed">
							{displayed}
						</div>
					</div>
				</div>
			</div>
		);
	}
}
/*
				<div className="chatbox">
					<Chatbox />
				</div>
*/

ReactDOM.render(<App />, document.getElementById("app"));
