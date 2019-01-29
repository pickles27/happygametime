import React from 'react';
import ReactDOM from 'react-dom';
import Home from './Home.jsx';
import Navbar from './Navbar.jsx';
import TicTacToe from './TicTacToe/TicTacToe.jsx';
import CreateAccount from './Auth/CreateAccount.jsx'
import Login from './Auth/Login.jsx';
import UserInfo from './Auth/UserInfo.jsx';
import Chatbox from './Chatbox/Chatbox.jsx';

class App extends React.Component {
	constructor() {
		super();
		this.state = {
			page: 'home',
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

	loginSubmit() {
		//axios call
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
			activeCreationDate: null
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
			displayed = <TicTacToe returnHome={this.returnHome}/>;
		} else if (selectedPage === 'createAccount') {
			displayed = <CreateAccount loginNewAccount={this.loginNewAccount} returnHome={this.returnHome}/>
		} else {
			displayed = <Home />;
		}

		if (isLoggedIn) {
			userSection = <UserInfo logOut={this.logOut} username={this.state.activeUsername} created={this.state.activeCreationDate} bio={this.state.activeUserBio} />
		} else {
			userSection = <Login onCreateAccountClick={this.onCreateAccountClick} loginSubmit={this.loginSubmit} />
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