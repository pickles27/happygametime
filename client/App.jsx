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
			loginUsername: null,
			loginPassword: null,
			activeUserId: null,
			activeUsername: null,
			activeUserEmail: null,
			activeCreationDate: null,
			activeUserBio: null,
			token: null
		}
		this.handleNavButtonClick = this.handleNavButtonClick.bind(this);
		this.onCreateAccountClick = this.onCreateAccountClick.bind(this);
		this.loginSubmit = this.loginSubmit.bind(this);
		this.loginNewAccount = this.loginNewAccount.bind(this);
		this.loginOnChange = this.loginOnChange.bind(this);
		this.logOut = this.logOut.bind(this);
		this.returnHome = this.returnHome.bind(this);
	}

	/*
		--- Navbar functions -------------------------------------------------------------------------------
	*/
	handleNavButtonClick(e) {
		e.preventDefault();
		var selection = e.target.name;
		this.setState({
			page: selection
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
		}).then((results) => {
			console.log('token received from axios call: ', results.data.token);
			this.setState({
				token: results.data.token,
				activeUserId: results.data.id,
				activeUsername: results.data.username,
				activeUserEmail: results.data.email,
				activeCreationDate: results.data.created
			});
		}).then(() => {
			this.setState({
				loginUsername: null,
				loginPassword: null
			});
		}).catch((error) => {
			console.log('error from loginSubmit axios call: ', error);
		});
	}

	loginNewAccount(userInfo) {
		this.setState({
			activeUsername: userInfo.username,
			activeUserId: userInfo.id,
			activeUserEmail: userInfo.email,
			activeCreationDate: userInfo.created
		});
	}

	logOut() {
		this.setState({
			activeUsername: null,
			activeUserId: null,
			activeUserEmail: null,
			activeUserBio: null,
			activeCreationDate: null,
			token: null
		});
	}

	/*
		-------------------------------------------------------------------------------------------------------
	*/


	render() {
		var selectedPage = this.state.page;
		var displayed;
		var userSection;
		var isLoggedIn = this.state.activeUserId ? true : false;

		if (selectedPage === 'tictactoe') {
			displayed = <TicTacToe appState={this.state} returnHome={this.returnHome}/>;
		} else if (selectedPage === 'createAccount') {
			displayed = <CreateAccount loginNewAccount={this.loginNewAccount} returnHome={this.returnHome}/>
		} else if (selectedPage === 'invites') {
			displayed = <Invites appState={this.state} />
		} else {
			displayed = <Home />;
		}

		if (isLoggedIn) {
			userSection = <UserInfo logOut={this.logOut} username={this.state.activeUsername} created={this.state.activeCreationDate} bio={this.state.activeUserBio} />
		} else {
			userSection = <Login loginOnChange={this.loginOnChange} onCreateAccountClick={this.onCreateAccountClick} loginSubmit={this.loginSubmit} />
		}

		return (
			<div>
				<Navbar handleNavButtonClick={this.handleNavButtonClick}/>
				{userSection}
				{displayed}
				<Chatbox />

			</div>
		);
	}
}

ReactDOM.render(<App />, document.getElementById("app"));