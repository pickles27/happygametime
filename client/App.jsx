import React from 'react';
import ReactDOM from 'react-dom';
import Home from './Home.jsx';
import Navbar from './Navbar.jsx';
import TicTacToe from './TicTacToe/TicTacToe.jsx';
import Login from './Authentication/Login.jsx';
import Chatbox from './Chatbox/Chatbox.jsx';

class App extends React.Component {
	constructor() {
		super();
		this.state = {
			page: 'home',
			// board: [null, null, null, null, null, null, null, null, null],
			// xTurn: true,
			// winner: null
		}
		this.handleNavButtonClick = this.handleNavButtonClick.bind(this);
		this.returnHome = this.returnHome.bind(this);
		// this.handleTTTButtonClick = this.handleTTTButtonClick.bind(this);
		// this.checkForWin = this.checkForWin.bind(this);
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
		----------------------------------------------------------------------------------------------------
	* 
		--- Tic Tac Toe functions ---------------------------------------------------------------------------
	*/
		// handleTTTButtonClick(e) {
		// 	e.preventDefault();
		// 	var index = parseInt(e.target.name);
		// 	var newBoard = this.state.board.slice();
		// 	if (newBoard[index] === null) {
		// 		newBoard[index] = this.state.xTurn ? 'X' : 'O';
			
		// 		this.setState({
		// 			board: newBoard
		// 		}, () => {
		// 			if (this.checkForWin(this.state.board)) {
		// 				var victor = this.state.xTurn ? 'X' : '0';
		// 				this.setState({
		// 					winner: victor
		// 				});
		// 			} else {
		// 				this.setState({
		// 					xTurn: !this.state.xTurn
		// 				});
		// 			}
		// 		});
		// 	}
		// }

		// checkForWin(boardArray) {
		// 	if (boardArray[0] && boardArray[0] === boardArray[1] && boardArray[1] === boardArray[2] ||
		// 			boardArray[3] && boardArray[3] === boardArray[4] && boardArray[4] === boardArray[5] ||
		// 			boardArray[6] && boardArray[6] === boardArray[7] && boardArray[7] === boardArray[8] ||
		// 			boardArray[0] && boardArray[0] === boardArray[3] && boardArray[3] === boardArray[6] ||
		// 			boardArray[1] && boardArray[1] === boardArray[4] && boardArray[4] === boardArray[7] ||
		// 			boardArray[2] && boardArray[2] === boardArray[5] && boardArray[5] === boardArray[8] ||
		// 			boardArray[0] && boardArray[0] === boardArray[4] && boardArray[4] === boardArray[8] ||
		// 			boardArray[2] && boardArray[2] === boardArray[4] && boardArray[4] === boardArray[6]) {
		// 		return true;
		// 	}
		// 	return false;
		// }

		// restartGame() {
		// 	var winner = this.state.winner;
		// 	var ask = confirm(`${winner} wins! Play again?`); //replace this with username
		// 	if (ask) {
		// 		this.setState({
		// 			board: [null, null, null, null, null, null, null, null, null],
		// 			xTurn: true,
		// 			winner: null
		// 		});
		// 	} else {
		// 		this.setState({
		// 			page: 'home',
		// 			board: [null, null, null, null, null, null, null, null, null],
		// 			xTurn: true,
		// 			winner: null
		// 		});
		// 	}
		// }
	/*
		----------------------------------------------------------------------------------------------------
	*/

	/*
		----------------------------------------------------------------------------------------------------
	*/

	/*
		----------------------------------------------------------------------------------------------------
	*/

	render() {
		var selectedPage = this.state.page;
		var displayed;

		if (selectedPage === 'home') {
			displayed = <Home />;
		} if (selectedPage === 'tictactoe') {
			displayed = <TicTacToe returnHome={this.returnHome}/>;
		}

		return (
			<div>
				<Navbar handleNavButtonClick={this.handleNavButtonClick}/>
				<Login />
				{displayed}
				<Chatbox />

			</div>
		);
	}
}

ReactDOM.render(<App />, document.getElementById("app"));