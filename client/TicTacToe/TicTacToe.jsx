import React from 'react';
import Board from './Board.jsx';
import axios from 'axios';

class TicTacToe extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			player1: null,
			player2: null,
			board: [null, null, null, null, null, null, null, null, null],
			xTurn: true,
			gameId: null,
			winner: null
		}
		this.handleTTTButtonClick = this.handleTTTButtonClick.bind(this);
		this.startNewGame = this.startNewGame.bind(this);
	}

	startNewGame(e) {
		e.preventDefault();
		axios.post('/game', {
			"type": "tictactoe",
			"player1": this.props.appState.activeUserId,
			"player2": "hardcodeplayer2"
		})
		.then((response) => {
			this.setState({
				player1: response.data.game.player1,
				player2: response.data.game.player2,
				gameId: response.data.id,
				board: [null, null, null, null, null, null, null, null, null],
				xTurn: true,
				winner: null
			});
		})
		.catch((error) => {
			console.log('error from startNewGame axios request on client side: ', error);
		});
	}

	handleTTTButtonClick(e) {
		e.preventDefault();
		var index = parseInt(e.target.name);
		axios.post(`/game/${this.state.gameId}/moves`, {
			location: index
		})
		.then((response) => {
			//after sending index to server,
			console.log('response.data: ', response.data);
			this.setState({
				board: response.data.game.state.board,
				xTurn: response.data.game.state.xTurn,
				winner: response.data.game.winner
			});
			//check if response says 'winner' is true
			//if so, deal with game win (already done in render)
		})
		.catch((error) => {
			console.log('error from tttbuttonclick axios call on client side: ', error);
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