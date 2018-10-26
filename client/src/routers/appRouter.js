import React from 'react';
import {BrowserRouter, Route, NavLink, Switch} from 'react-router-dom';

import Index from '../components/index.js';
import Login from '../components/Login';
//import {handleForm} from '../components/Login'
import NotFound from '../components/NotFound';
import SignUp from '../components/SignUp';
import UserPage from '../components/UserPage';


const AppRouter = () => {
    return (

            <BrowserRouter>
                <Switch>
                    <Route path='/' component={Index} exact={true} />
                    <Route path='/login' component={Login}/>
                    <Route path='/signup' component={SignUp}/>
                    <Route path='/users/me' component={UserPage} />
                    <Route component={NotFound} />
                </Switch>

            </BrowserRouter>

    );   //handle localStorage shit in componentDidMount in UserPAge
};

export {
    AppRouter as default
};
