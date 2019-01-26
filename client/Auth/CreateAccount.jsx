import React from 'react';
import axios from 'axios';

  
class CreateAccount extends React.Component {
	constructor() {
		super();

		this.state = {
      username: null,
      email: null,
      password: null,
      password2: null
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
  	.then(() => {
  		//return user id and set state with it
  		console.log('createaccount axios success!');
  		this.setState({
  			username: null,
  			email: null,
  			password: null,
  			password2: null
  		});
  	})
  	.catch((error) => {
  		console.log('createaccount axios error: ', error);
  	});
  }

	render() {
    return (
      <div>
      	<h2>Create your account:</h2>
      	<h5>Email: </h5>
      	<input type="text" onChange={this.onChange} name="email" />
      	<h5>Username: </h5>
      	<input type="text" onChange={this.onChange} name="username" />
      	<h5>Password (at least 6 characters): </h5>
      	<input type="text" onChange={this.onChange} name="password" />
      	<h5>Confirm Password: </h5>
      	<input type="text" onChange={this.onChange} name="password2" />
      	<button onClick={this.onSubmit}>Create Account</button>
      </div>
    );
	}
}

export default CreateAccount;