import React from 'react';
import axios from 'axios';

  
class CreateAccount extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
      username: null,
      email: null,
      password: null,
      password2: null,
      errorMessage: null
		}
		this.onChange = this.onChange.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
	}

  onChange(e) {
    this.setState({
      [e.target.name]: e.target.value 
    });
  }

  onSubmit(e) {
  	e.preventDefault();
  	axios.post('/createaccount', {
  		username: this.state.username,
  		email: this.state.email,
  		password: this.state.password,
  		password2: this.state.password2
  	})
  	.then((userInfo) => {
  		console.log(userInfo); //userInfo.data gives object with username, id, email and created (time)
      //log in user automatically
      this.props.loginNewAccount(this.state.username, this.state.password);
    })
    .then(() => {
      this.setState({
        username: null,
        email: null,
        password: null,
        password2: null,
      });
    })
    .then(() => {
      this.props.returnHome();
    })
  	.catch((error) => {
  		console.log('createaccount axios error: ', error.response.data.message);
      this.setState({
        errorMessage: error.response.data.message
      });
  	});
  }

	render() {
    if (this.state.errorMessage) {
      var errorMessage = <h5 className="errorMessage">{this.state.errorMessage}</h5>
    }
    return (
      <div>
      	<h2>Create your account:</h2>
      	<h5>Email: </h5>
      	<input type="email" onChange={this.onChange} name="email" />
      	<h5>Username: </h5>
      	<input type="text" onChange={this.onChange} name="username" />
      	<h5>Password (at least 6 characters): </h5>
      	<input type="password" onChange={this.onChange} name="password" />
      	<h5>Confirm Password: </h5>
      	<input type="password" onChange={this.onChange} name="password2" />
      	<button onClick={this.onSubmit}>Create Account</button>
        {errorMessage}
      </div>
    );
	}
}

export default CreateAccount;