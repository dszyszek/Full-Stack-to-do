import React from 'react';
import {NavLink} from 'react-router-dom';

const GoBack = () => {
    return (
        <div>
             <NavLink to='/'>Go back</NavLink>
        </div>
    );
};

export {
    GoBack as default
};