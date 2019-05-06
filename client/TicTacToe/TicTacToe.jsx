import React from 'react';
import Board from './Board.jsx';
import axios from 'axios';
import ActiveGames from '../ActiveGames.jsx';
import API from '../api.js';

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
			begin: null,
			inviteRecipient: '',
			inviteMessage: ''
		}
		this.handleTTTButtonClick = this.handleTTTButtonClick.bind(this);
		this.startNewGame = this.startNewGame.bind(this);
		this.sendInvite = this.sendInvite.bind(this);
		this.onChange = this.onChange.bind(this);
		this.beginGame = this.beginGame.bind(this);
	}

	//need to make list of active games open
	//selected active game
	componentDidMount() {
		if (this.props.appState.activeGame !== null) {
			this.beginGame(this.props.appState.activeGame); //IS THIS CORRECT????
		}
		this.props.socket.on('tttclick', (data) => {
			//index and xturn
			var updatedBoard = this.state.board;
			updatedBoard[data.index] = data.xTurn ? 'X' : 'O';
			this.setState({
				board: updatedBoard
			});
		})
	}

	onChange(e) {
		this.setState({
			[e.target.name]: e.target.value
		});
	}

	sendInvite(e) {
		e.preventDefault();
		API.post('/invitations', {
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
		var token = localStorage.getItem('userToken');
		//need to add player from previous game as player 2
		API.post('/game', {
			"type": "tictactoe",
			"player1": this.props.appState.activeUserId,
			"player2": "hardcodeplayer2"
		}, {
			headers: {
				Authorization: 'Bearer ' + token
			}
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
		var token = localStorage.getItem('userToken');
		var userId = localStorage.getItem('userId');
		var index = parseInt(e.target.name);
		API.post(`/game/${this.state.gameId}/moves`, {
			'location': index,
			'userId': userId
		}, {
			headers: {
				Authorization: 'Bearer ' + token
			}
		})
		.then((response) => {
			this.setState({
				board: response.data.game.state.board,
				xTurn: response.data.game.state.xTurn,
				winner: response.data.game.winner
			});
			//check if response says 'winner' is true
			//if so, deal with game win (already done in render)
			//CHANGE GAME SO THAT BOARD DOESN'T DISAPPEAR WHEN SOMEONE WINS
		})
		.then(() => {
			//emit button click
			//xTurn is toggled because returns from server already switched
			this.props.socket.emit('tttclick', {index: index, xTurn: !this.state.xTurn});
			//game is allowing me to move around. shouldn't let me click again after i make a valid move
			//check and see if it's actually changing the board or not,, NO IT ISN'T CHANGING THE BOARD
			//figure this shit out
		})
		.catch((error) => {
			console.log('error from tttbuttonclick axios call on client side: ', error);
		});
	}

	beginGame(game) {
		//this triggers when activeGame exists in App state
		//game = this.props.appState.activeGame , {id: 342, game: {}}
		this.setState({
			player1: game.game.player1,
			player2: game.game.player2,
			board: game.game.state.board,
			xTurn: game.game.state.xTurn,
			gameId: game.id,
			begin: game.game.begin
		});
	}

	render(props) {
		var displayed;
		if (!this.props.appState.activeUserId) {
			displayed = <h4>log in to start or join a game :D</h4>;
		} 
		if (this.state.gameId === null) {
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