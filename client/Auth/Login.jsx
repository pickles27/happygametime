import React from 'react';

var Login = (props) => {
  return (
    <div className="login">
      <h4>Log In:</h4>
      <input type="text" name="username" placeholder="username" />
      <input type="text" name="password" placeholder="password" />
      <button onClick={props.loginSubmit}>Log In</button>
      <h5>or</h5>
      <button onClick={props.onCreateAccountClick}>Create Account</button>
    </div>
  );
}

export default Login;