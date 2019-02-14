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
			winner: null,
			inviteRecipient: null,
			inviteMessage: null
		}
		this.handleTTTButtonClick = this.handleTTTButtonClick.bind(this);
		this.startNewGame = this.startNewGame.bind(this);
		this.sendInvite = this.sendInvite.bind(this);
		this.onChange = this.onChange.bind(this);
	}

	//need to make list of active games open
	//selected active game

	onChange(e) {
		this.setState({
			[e.target.name]: e.target.value
		});
	}

	sendInvite(e) {
		e.preventDefault();
		axios.post('/invitations', {
			recipient: this.state.inviteRecipient,
			sender: this.props.appState.activeUserId,
			gameType: 'tictactoe',
			customMessage: this.state.inviteMessage
		}).then((response) => {
			//do something with response
			console.log('response from sendInvite: ', response);
			//display message: 'invitation sent!' if no error
		}).catch((error) => {
			console.log('error from sendInvite axios request on client side: ', error.response);
		})
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
			console.log('error from startNewGame axios request on client side: ', error.response);
		});
	}

	handleTTTButtonClick(e) {
		e.preventDefault();
		var index = parseInt(e.target.name);
		axios.post(`/game/${this.state.gameId}/moves`, {
			'location': index
		})
		.then((response) => {
			//after sending index to server,
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
		if (!this.props.appState.activeUserId) {
			displayed = <h4>log in to start or join a game :D</h4>;
		} else if (this.state.gameId === null) {
			displayed =
			<div className="gameInvitationComponent">
				<h3>new game invitation: </h3>
				<input type="text" className="newGameInvitationField" name="inviteRecipient" placeholder="username or email" onClick={this.onChange} />
				<textarea className="customInviteMessageField" name="inviteMessage" placeholder="(optional) add a custom message :)" onClick={this.onChange}></textarea>
				<input type="button" className="sendInvitationButton" value="send" onClick={this.sendInvite} />
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
			<div className="tttInvitationDiv">
				<h1>tic tac toe</h1>
				{displayed}
			</div>
		);
	}
}

export default TicTacToe;