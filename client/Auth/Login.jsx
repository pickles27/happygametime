import React from 'react';

var Login = (props) => {
  var error = <h5 className="errorMessage">{props.loginErrorMessage}</h5>
  return (
    <div className="login">
      <h4 className="loginHeader">log in:</h4>
      <input className="loginInput" onChange={props.loginOnChange} type="text" name="loginUsername" placeholder="username" />
      <input className="loginInput" onChange={props.loginOnChange} type="password" name="loginPassword" placeholder="password" />
      <button className="loginButton" onClick={props.loginSubmit}>log in</button>
      <h5 className="loginOrText">or</h5>
      <button className="loginButton" onClick={props.onCreateAccountClick}>create account</button>
      {error}
    </div>
  );
}

export default Login;