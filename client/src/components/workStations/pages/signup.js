import React from 'react';

const SignUp = (props) => (
    
        
            <form>
                <div>
                    <h2>Create a New Account</h2>
                </div>
                <div className='col-sm-4'>
                    <div className='form-group'>
                        <label for='exampleFirstName'>First Name</label>
                        <input type='text' className='form-control' id='exampleFirstName' placeholder='First Name'></input>
                    </div>
                </div>
                <div className='col-sm-4'>
                    <div className='form-group'>
                        <label for='exampleLastName'>Last Name</label>
                        <input type='text' className='form-control' id='exampleLastName' placeholder='Last Name'></input>
                    </div>
                </div>
                <div className='col-sm-8'>
                    <div className='form-group'>
                        <label for='exampleInputEmail1'>Email address</label>
                        <input type='email' className='form-control' id='exampleInputEmail1' placeholder='Enter Email'></input>
                    </div>
                </div>
                <div className='col-sm-8'>
                    <div className='form-group'>
                        <label for='exampleInputPassword1'>New Password</label>
                        <input type='password' className='form-control' id='exampleInputPassword1' placeholder='Password'></input>
                    </div>
                </div>
                <div className='col-sm-8'>
                <button type='Submit' className='btn btn-primary'>Sign Up!</button>
                </div>
            </form>
)
export default SignUp;