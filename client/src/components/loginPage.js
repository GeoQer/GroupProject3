import React from 'react';
import Login from './workStations/pages/login';
import SignUp from './workStations/pages/signup';
import './loginPage.css';

class LoginPage extends React.Component {
    render() {
        return (
            <div className='container'>
                <div className='row'>
                    <div className='col-sm-3'>
                        <Login />
                    </div>
                </div>
            </div>
        );
    }
}
export default LoginPage;