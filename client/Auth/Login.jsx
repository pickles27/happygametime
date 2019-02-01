import React from 'react';

var Login = (props) => {
  return (
    <div className="login">
      <h4>Log In:</h4>
      <input onChange={props.loginOnChange} type="text" name="loginUsername" placeholder="username" />
      <input onChange={props.loginOnChange} type="password" name="loginPassword" placeholder="password" />
      <button onClick={props.loginSubmit}>Log In</button>
      <h5>or</h5>
      <button onClick={props.onCreateAccountClick}>Create Account</button>
    </div>
  );
}

export default Login;