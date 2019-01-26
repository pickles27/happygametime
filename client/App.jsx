import React from 'react';
import ReactDOM from 'react-dom';
import Home from './Home.jsx';
import Navbar from './Navbar.jsx';
import TicTacToe from './TicTacToe/TicTacToe.jsx';
import CreateAccount from './Auth/CreateAccount.jsx'
import Login from './Auth/Login.jsx';
import Chatbox from './Chatbox/Chatbox.jsx';

class App extends React.Component {
	constructor() {
		super();
		this.state = {
			page: 'home',
		}
		this.handleNavButtonClick = this.handleNavButtonClick.bind(this);
		this.onCreateAccountClick = this.onCreateAccountClick.bind(this);
		this.loginSubmit = this.loginSubmit.bind(this);
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
	/*
		-------------------------------------------------------------------------------------------------------
	*/


	render() {
		var selectedPage = this.state.page;
		var displayed;

		if (selectedPage === 'tictactoe') {
			displayed = <TicTacToe returnHome={this.returnHome}/>;
		} else if (selectedPage === 'createAccount') {
			displayed = <CreateAccount />
		} else {
			displayed = <Home />;
		}

		return (
			<div>
				<Navbar handleNavButtonClick={this.handleNavButtonClick}/>
				<Login onCreateAccountClick={this.onCreateAccountClick} loginSubmit={this.loginSubmit}/>
				{displayed}
				<Chatbox />

			</div>
		);
	}
}

ReactDOM.render(<App />, document.getElementById("app"));