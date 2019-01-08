import React from 'react';

var Navbar = (props) => {
	//state: {page: either home, tictactoe, checkers, etc}
	return (
		<div className="navbar">
			<input type="button" className="navbutton" name="home" value="Home" onClick={props.handleNavButtonClick}></input>
			<input type="button" className="navbutton" name="tictactoe" value="Tic Tac Toe" onClick={props.handleNavButtonClick}></input>
			<button className="navbutton" name="checkersButton">Checkers</button>
			<button className="navbutton" name="chessButton">Chess</button>
			<button className="navbutton" name="connectFourButton">Connect Four</button>
		</div>
	);
}

export default Navbar;