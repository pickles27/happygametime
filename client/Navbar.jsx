import React from 'react';

var Navbar = (props) => {
	//state: {page: either home, tictactoe, checkers, etc}
	return (
		<div className="navbar">
			<button name="home" onClick={props.handleNavButtonClick}>home</button>
			<button name="invites" onClick={props.handleNavButtonClick}>invites</button>
			<button name="tictactoe" onClick={props.handleNavButtonClick}>tic tac toe</button>
			<button name="checkersButton">checkers</button>
			<button name="chessButton">chess</button>
			<button name="connectFourButton">connect four</button>
		</div>
	);
}

export default Navbar;