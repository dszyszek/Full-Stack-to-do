import React from 'react';
import {BrowserRouter, Route, NavLink, Switch} from 'react-router-dom';

import Index from '../components/index';
import Login from '../components/Login';
import NotFound from '../components/NotFound';

const AppRouter = () => {
    return (

            <BrowserRouter>
                <Switch>
                    <Route path='/' component={Index} exact={true} />
                    <Route path='/login' component={Login}/>
                    <Route component={NotFound} />
                </Switch>

            </BrowserRouter>

    );
};

export {
    AppRouter as default
};
