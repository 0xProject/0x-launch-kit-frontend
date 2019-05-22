import { ConnectedRouter } from 'connected-react-router';
import React from 'react';
import ReactDOM from 'react-dom';
import ReactModal from 'react-modal';
import { Provider } from 'react-redux';
import 'sanitize.css';

import { LOGGER_ID } from './common/constants';
import { AppContainer } from './components/app';
import './index.css';
import * as serviceWorker from './serviceWorker';
import { history, store } from './store';

ReactModal.setAppElement('#root');

if (['development', 'production'].includes(process.env.NODE_ENV) && !window.localStorage.debug) {
    // Log only the app constant id to the console
    window.localStorage.debug = `${LOGGER_ID}*`;
}

const Web3WrappedApp = (
    <Provider store={store}>
        <ConnectedRouter history={history}>
            <AppContainer />
        </ConnectedRouter>
    </Provider>
);

ReactDOM.render(Web3WrappedApp, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
