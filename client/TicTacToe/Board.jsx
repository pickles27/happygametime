import React from 'react';

var Board = (props) => {
	return (
		<div>
			<div>
				<input type="button" className="tttbutton" name="0" value={props.board[0]} onClick={props.handleTTTButtonClick}></input>
				<input type="button" className="tttbutton" name="1" value={props.board[1]} onClick={props.handleTTTButtonClick}></input>
				<input type="button" className="tttbutton" name="2" value={props.board[2]} onClick={props.handleTTTButtonClick}></input>
			</div>
			<div>
				<input type="button" className="tttbutton" name="3" value={props.board[3]} onClick={props.handleTTTButtonClick}></input>
				<input type="button" className="tttbutton" name="4" value={props.board[4]} onClick={props.handleTTTButtonClick}></input>
				<input type="button" className="tttbutton" name="5" value={props.board[5]} onClick={props.handleTTTButtonClick}></input>
			</div>
			<div>
				<input type="button" className="tttbutton" name="6" value={props.board[6]} onClick={props.handleTTTButtonClick}></input>
				<input type="button" className="tttbutton" name="7" value={props.board[7]} onClick={props.handleTTTButtonClick}></input>
				<input type="button" className="tttbutton" name="8" value={props.board[8]} onClick={props.handleTTTButtonClick}></input>
			</div>
		</div>
	);
}

export default Board;