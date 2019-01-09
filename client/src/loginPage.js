import React from 'react';
import Login from './components/workStations/pages/login';


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