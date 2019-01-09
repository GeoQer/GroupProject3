import React from 'react';
import "./login.css";
import Axios from 'axios';
import {Redirect} from 'react-router-dom';

class Login extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            err: null,
            email: localStorage.getItem('email') || null,
            password: null,
            rememberMe: localStorage.getItem('email') ? true : false
        }
    }

    componentDidMount(){
        if(this.state.email){
            document.getElementById('exampleCheck1').click();
            document.getElementById('exampleInputEmail1').value = this.state.email;
        }
    }

    handleInput = (event) =>{
        const name = event.target.name;
        const value = event.target.value;
        this.setState({[name]: value})
    }

    handleCheckBox = (event) =>{
        const value = event.target.checked;
        this.setState({rememberMe: value});
    }

    handleSubmit = (event) =>{
        this.setState({err: {}})
        event.preventDefault();
        Axios.post('api/v1/auth/login', {
            email: this.state.email,
            password: this.state.password
        })
        .then(result => {
            console.log(result.data);
            if(result.data.err){
                this.setState({err: result.data.err});
                return;
            }
            if(this.state.rememberMe === true)
                localStorage.setItem('email', this.state.email);
            else
                localStorage.removeItem('email');

            sessionStorage.setItem('isAdmin', result.data.isAdmin);
            sessionStorage.setItem('uid', result.data.uid);
            this.setState({isAdmin: result.data.isAdmin});
        });
    }

    render(props) {
        if(this.state.isAdmin === true){
           return <Redirect to="/admin" />
        }
        else if(this.state.isAdmin === false){
            return <Redirect to="/employee" />
        }


        return (
            <div className='form-align'>
                <form className='loginForm'>
                    <div>
                        <h3>Sign In</h3>
                    </div>
                    <div className='form-group'>
                        <label htmlFor='exampleInputEmail1'>Email address</label>
                        <input name="email" onChange={this.handleInput} type='email' className='form-control' id='exampleInputEmail1' placeholder='Enter Email'></input>
                    </div>
                    <div className='form-group'>
                        <label htmlFor='exampleInputPassword1'>Password</label>
                        <input name="password" onChange={this.handleInput} type='password' className='form-control' id='exampleInputPassword1' placeholder='Password'></input>
                    </div>
                    <div className='form-check'>
                        <input name="rememberMe" onChange={this.handleCheckBox} type='checkbox' className='form-check-input' id='exampleCheck1'></input>
                        <label className='form-check-label' htmlFor='exampleCheck1'>Remember me</label>
                    </div>
                    <button type='Submit' className='btn btn-primary' onClick={this.handleSubmit}>Submit</button>
                </form>
                <h5 style={{color: 'red'}}>{this.state.err ? this.state.err.message : ''}</h5>
            </div>
        );
    }
}
export default Login;