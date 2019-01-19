import React from "react";
import { Link } from 'react-router-dom';

import "./Notfound.css"; 

class Notfound extends React.Component {
    render() {
        return (
          <div className='z'>
            <div className='container'>
                <div className='row'>
                    <div className='col-sm-3'>
                        <h1>404: Page not Found</h1>
                        <Link to="/">Return to login</Link>
                    </div>
                </div>
            </div>
        </div>
        );
    }
}

export default Notfound;