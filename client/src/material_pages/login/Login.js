import React from 'react';
import Axios from 'axios';
import M from 'materialize-css';

export default class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            remember: false,
            checked: null,
            err: null
        }
    }

    componentDidMount = () => {
        if (this.state.checked === null) {
            const credentials = JSON.parse(localStorage.getItem('credentials'));
            if (credentials) {
                this.setState({ email: credentials.email, password: credentials.password, checked: true, remember: true });
            }
            else
                this.setState({ checked: false })
        }
    }

    handleInputChange = event => {
        const target = event.target;
        const value = target.value;
        this.setState({ [target.name]: value, err: null });
    }

    handleCheckboxChange = () => {
        this.setState(prevState => ({
            remember: !prevState.remember
        }))
    }

    handleSubmit = (e) => {
        e.preventDefault();

        if (this.state.remember) {
            localStorage.setItem('credentials', JSON.stringify({ email: this.state.email, password: this.state.password }))
        }
        else
            localStorage.clear();

        Axios.post('/api/v1/auth/login', {
            email: this.state.email,
            password: this.state.password
        })
            .then(result => {
                if (result.data.err) {
                    this.setState({ err: result.data.err });
                    return;
                }

                const obj = {
                    uid: result.data.uid,
                    token: result.data.token,
                    isAdmin: result.data.isAdmin,
                    name: result.data.name
                }

                sessionStorage.setItem('userInfo', JSON.stringify(obj));
                this.props.history.push('/admin');
            })
            .catch(err => this.setState({ err }))
    }

    render() {
        return (
            <div className="container" >
                <div className="row">
                    <div style={{ height: '20vh' }} />
                </div>
                <div className="row">
                    <div className="col s12 m6 offset-m3">
                        <div className="card">
                            <div className="card-content">
                                <span className="card-title">Sign In</span>
                                <form>
                                    <div className="row" onClick={() => document.getElementById('email').focus()}>
                                        <div className="input-field">
                                            <i className="material-icons prefix">email_circle</i>
                                            <input id="email" name="email" type="text" onChange={this.handleInputChange} value={this.state.email} />
                                            <label htmlFor="email">Email</label>
                                        </div>
                                    </div>
                                    <div className="row" onClick={() => document.getElementById('password').focus()}>
                                        <div className="input-field">
                                            <i className="material-icons prefix">lock</i>
                                            <input id="password" name="password" type="password" onChange={this.handleInputChange} value={this.state.password} />
                                            <label htmlFor="password">Password</label>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <p>
                                            <label>
                                                {this.state.checked ?
                                                    <input type="checkbox" defaultChecked onChange={this.handleCheckboxChange} />
                                                    :
                                                    <input type="checkbox" onChange={this.handleCheckboxChange} />
                                                }
                                                <span>Remember Me</span>
                                            </label>
                                        </p>
                                    </div>
                                    <div className="row">
                                        <div className="input-field">
                                            <button className="btn waves-effect waves-light blue" onClick={this.handleSubmit}>Sign In</button>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <h6 className="red-text">{this.state.err ? this.state.err.message : null}</h6>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}