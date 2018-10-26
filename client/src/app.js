import React from 'react';
import ReactDOM from 'react-dom';
import 'normalize.css/normalize.css';
import './styles/styles.scss';
import 'babel-polyfill';

import AppRouter from './routers/appRouter.js';





ReactDOM.render(<AppRouter />, document.querySelector('#app'));
