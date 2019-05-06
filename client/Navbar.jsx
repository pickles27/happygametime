import React from 'react';

var Navbar = (props) => {
	//state: {page: either home, tictactoe, checkers, etc}
	return (
		<div className="navbar">
			<button className="navbarButton" name="home" onClick={props.handleNavButtonClick}>home</button>
			<button className="navbarButton" name="notifications" onClick={props.handleNavButtonClick}>notifications</button>
			<button className="navbarButton" name="tictactoe" onClick={props.handleNavButtonClick}>tic tac toe</button>
			<button className="navbarButton" name="checkersButton">checkers</button>
			<button className="navbarButton" name="chessButton">chess</button>
			<button className="navbarButton" name="connectFourButton">connect four</button>
		</div>
	);
}

export default Navbar;