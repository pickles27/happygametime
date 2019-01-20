import React from 'react';
import Board from './Board.jsx';
import axios from 'axios';

class TicTacToe extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			board: [null, null, null, null, null, null, null, null, null],
			xTurn: true,
			gameId: null
		}
		this.handleTTTButtonClick = this.handleTTTButtonClick.bind(this);
		this.startNewGame = this.startNewGame.bind(this);
	}

	startNewGame(e) {
		e.preventDefault();
		axios.post('/game', {
			"type": "tictactoe",
			"player1": "hardcodeplayer1",
			"player2": "hardcodeplayer2"
		})
		.then((response) => {
			this.setState({
				gameId: response.data.id,
				board: [null, null, null, null, null, null, null, null, null],
				xTurn: true,
			});
		})
		.catch((error) => {
			console.log(error);
		});
	}

	handleTTTButtonClick(e) {
		e.preventDefault();
		var index = parseInt(e.target.name);
		axios.post(`/games/${this.state.gameId}/moves`, {
			location: index
		})
		.then((response) => {
			//after sending index to server,
			console.log(response.data);
			//check if response says 'winner' is true
			//if so, deal with game win (already done in render)

			//want for response:
			//winner (null, player1 or player2)
			//xTurn (true or false) toggles on back end with end turn, server needs to be source of truth so do this there
			//new game board from server

			//set state so that state is current
			//don't need to make sure spot is empty because i will do this on the back end
			//need to switch turns on back end and update board on back end
		
			// this.setState({
			// 	//board: newBoard (from response)
			// 	//winner: null, player 1 or player 2 (from response)
			// 	//xTurn: true or false (from response)
			// });
		})
		.catch((error) => {
			console.log('error from tttbuttonclick axios call: ', error.response);
		});
		// var newBoard = this.state.board.slice();
		// if (newBoard[index] === null) {
		// 	newBoard[index] = this.state.xTurn ? 'X' : 'O';
		
		// 	this.setState({
		// 		board: newBoard
		// 	}, () => {
		// 		if (this.checkForWin(this.state.board)) {
		// 			var victor = this.state.xTurn ? 'X' : '0';
		// 			this.setState({
		// 				winner: victor
		// 			});
		// 		} else {
		// 			this.setState({
		// 				xTurn: !this.state.xTurn
		// 			});
		// 		}
		// 	});
		// }
	}

	render(props) {
		var displayed;
		if (this.state.gameId === null) {
			displayed =
			<div>
				<h3>Start new game?</h3>
				<input type="button" className="newGameButton" value="YES" onClick={this.startNewGame}/>
			</div>;
		} else {
			if (!this.state.winner) {
				displayed = <Board board={this.state.board} handleTTTButtonClick={this.handleTTTButtonClick}/>;
			} else {
				displayed = 
				<div>
					<p>{this.state.winner} wins! Play again?</p>
					<input type="button" className="playAgainButton" value="YES" onClick={this.startNewGame} />
					<input type="button" className="playAgainButton" value="NO" onClick={this.props.returnHome} />
				</div>;
			}
	  }
		return (
			<div>
				<h1>Tic Tac Toe</h1>
				{displayed}
			</div>
		);
	}
}

export default TicTacToe;