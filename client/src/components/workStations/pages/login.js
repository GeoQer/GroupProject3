import React from 'react';

const Login = (props) => (   
    <div className='form-align'>
                <form className='loginForm'>
                    <div>
                        <h3>Sign In</h3>
                    </div>
                    <div className='form-group'>
                        <label for='exampleInputEmail1'>Email address</label>
                        <input type='email' className='form-control' id='exampleInputEmail1' placeholder='Enter Email'></input>
                    </div>
                    <div className='form-group'>
                        <label for='exampleInputPassword1'>Password</label>
                        <input type='password' className='form-control' id='exampleInputPassword1' placeholder='Password'></input>
                    </div>
                    <div className='form-check'>
                        <input type='checkbox' className='form-check-input' id='exampleCheck1'></input>
                        <label className='form-check-label' for='exampleCheck1'>Remember me</label>
                    </div>
                    <button type='Submit' className='btn btn-primary'>Submit</button>
                </form>
                </div> 
);
export default Login;