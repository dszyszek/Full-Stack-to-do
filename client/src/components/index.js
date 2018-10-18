import React from 'react';
import {NavLink} from 'react-router-dom'; 


class Index extends React.Component {
    render = () => {
        return (
            <div>

                <div>                           {/* Bar */}
                    
                    <button>Sing up</button>
                    <NavLink to='/login'>Log in</NavLink>
                    
                </div>

                <div>                           {/* Content */}
                    <h1>Welcome to my To-do App!</h1>
                    <h3>Please log in or sing up to proceed</h3>

                </div>


            </div>
            
        );
    }
}

export {
    Index as default
}