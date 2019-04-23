import { ConnectedRouter } from 'connected-react-router';
import React from 'react';
import ReactDOM from 'react-dom';
import ReactModal from 'react-modal';
import { Provider } from 'react-redux';
import { Redirect, Route, Switch } from 'react-router';
import 'sanitize.css';

import { DEFAULT_BASE_PATH, ERC20APP_BASE_PATH, ERC721APP_BASE_PATH, LOGGER_ID } from './common/constants';
import { AppContainer } from './components/app';
import { AdBlockDetector } from './components/common/adblock_detector';
import { Erc20App } from './erc20/components/erc20_app';
import { Erc721App } from './erc721/components/erc721_app';
import './index.css';
import * as serviceWorker from './serviceWorker';
import { history, store } from './store';

ReactModal.setAppElement('#root');

const RedirectToHome = () => <Redirect to={DEFAULT_BASE_PATH} />;

if (['development', 'production'].includes(process.env.NODE_ENV) && !window.localStorage.debug) {
    // Log only the app constant id to the console
    window.localStorage.debug = `${LOGGER_ID}*`;
}

const Web3WrappedApp = (
    <Provider store={store}>
        <ConnectedRouter history={history}>
            <AppContainer>
                <AdBlockDetector />
                <Switch>
                    <Route path={ERC20APP_BASE_PATH} component={Erc20App} />
                    <Route path={ERC721APP_BASE_PATH} component={Erc721App} />
                    <Route component={RedirectToHome} />
                </Switch>
            </AppContainer>
        </ConnectedRouter>
    </Provider>
);

ReactDOM.render(Web3WrappedApp, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
