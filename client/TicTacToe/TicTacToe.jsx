import React from 'react';
import Board from './Board.jsx';

class TicTacToe extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			board: [null, null, null, null, null, null, null, null, null],
			xTurn: true,
			winner: null
		}
		this.handleTTTButtonClick = this.handleTTTButtonClick.bind(this);
		this.checkForWin = this.checkForWin.bind(this);
		this.restartGame = this.restartGame.bind(this);
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

	checkForWin(boardArray) {
		if (boardArray[0] && boardArray[0] === boardArray[1] && boardArray[1] === boardArray[2] ||
				boardArray[3] && boardArray[3] === boardArray[4] && boardArray[4] === boardArray[5] ||
				boardArray[6] && boardArray[6] === boardArray[7] && boardArray[7] === boardArray[8] ||
				boardArray[0] && boardArray[0] === boardArray[3] && boardArray[3] === boardArray[6] ||
				boardArray[1] && boardArray[1] === boardArray[4] && boardArray[4] === boardArray[7] ||
				boardArray[2] && boardArray[2] === boardArray[5] && boardArray[5] === boardArray[8] ||
				boardArray[0] && boardArray[0] === boardArray[4] && boardArray[4] === boardArray[8] ||
				boardArray[2] && boardArray[2] === boardArray[4] && boardArray[4] === boardArray[6]) {
			return true;
		}
		return false;
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
		if (!this.state.winner) {
			displayed = <Board board={this.state.board} handleTTTButtonClick={this.handleTTTButtonClick}/>;
		} else {
			displayed = 
			<div>
				<p>{this.state.winner} wins! Play again?</p>
				<input type="button" className = "playAgainButton" value="YES" onClick={this.restartGame} />
				<input type="button" className = "playAgainButton" value="NO" onClick={this.props.returnHome} />
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