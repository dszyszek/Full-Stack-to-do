import React from 'react';

import createHistory from 'history/createBrowserHistory'


import GoBack from './GoBack';

const handleAuth = () => {


};

class UserPage extends React.Component {
        
    state = {
        token: undefined,
        id: undefined,
        email: undefined
    }

    componentWillMount = () => {
        try {
            const json = localStorage.getItem('token');
            const token = JSON.parse(json);
            
            if (token) {
                this.setState(() => {
                    return {
                        token: token,
                }
                });
            }
        } catch(e) {

        }
    };

    componentDidMount = () => {

        try {
            
           //console.log(tkn, 'token');

            fetch('http://localhost:3000/users/me', {
                method: 'get',
                headers: {
                    'x-auth': this.state.token
                }
            }).then(res => res.json())
            .then(res => {
                console.log(res, 'from component GET fetch')
                this.setState((prev) => {
                    return {
                        token: prev.token,
                        email: res['email'],
                        id: res['_id']
                }
                });
            });

        } catch(e) {
            console.log('Problem with fetching token!');
        }

        history.pushState(null, '/');
        history.pushState(null, '/users/me');
    }




    render = () => {


        return (
            <div>
                <h1>User Page</h1>
                <h3>Welcome user {this.state.email || 'anonymous'}!</h3>
                <p>Your security token: {this.state.token || 'Cannot fetch token'}</p>
                <GoBack />
            </div>
        );
    };

};

export {
    UserPage as default
}