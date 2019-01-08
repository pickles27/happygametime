import React from 'react';
import Board from './Board.jsx';
import axios from 'axios';

class TicTacToe extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			board: [null, null, null, null, null, null, null, null, null],
			xTurn: true,
			winner: null,
			gameId: null
		}
		this.handleTTTButtonClick = this.handleTTTButtonClick.bind(this);
		this.restartGame = this.restartGame.bind(this);
		this.startNewGame = this.startNewGame.bind(this);
	}

	startNewGame(e) {
		e.preventDefault();
		axios.post('/new', {
			"type": "tictactoe",
			"player1": "hardcodeplayer1",
			"player2": "hardcodeplayer2"
		})
		.then((response) => {
			//response should include id
			//response.body.id or just response.id?
			this.setState({
				gameId: response.id
			});
		})
		.catch((error) => {
			console.log('error from startNewGame post request: ', error);
		});
	}

	handleTTTButtonClick(e) {
		e.preventDefault();
		var index = parseInt(e.target.name);
		var newBoard = this.state.board.slice();
		if (newBoard[index] === null) {
			newBoard[index] = this.state.xTurn ? 'X' : 'O';
		
			this.setState({
				board: newBoard
			}, () => {
				if (this.checkForWin(this.state.board)) {
					var victor = this.state.xTurn ? 'X' : '0';
					this.setState({
						winner: victor
					});
				} else {
					this.setState({
						xTurn: !this.state.xTurn
					});
				}
			});
		}
	}

	restartGame() {
			this.setState({
				board: [null, null, null, null, null, null, null, null, null],
				xTurn: true,
				winner: null
			});
  }

	render(props) {
		var displayed;
		if (this.state.gameId === null) {
			displayed =
			<div>
				<h3>Start new game?</h3>
				<input type="button" className="newGameButton" value="YES" onClick={this.startNewGame}/>
			</div>;
		}
		if (!this.state.winner) {
			displayed = <Board board={this.state.board} handleTTTButtonClick={this.handleTTTButtonClick}/>;
		} else {
			displayed = 
			<div>
				<p>{this.state.winner} wins! Play again?</p>
				<input type="button" className="playAgainButton" value="YES" onClick={this.restartGame} />
				<input type="button" className="playAgainButton" value="NO" onClick={this.props.returnHome} />
			</div>;
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