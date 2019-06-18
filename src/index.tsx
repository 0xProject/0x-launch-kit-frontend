import { ConnectedRouter } from 'connected-react-router';
import React from 'react';
import ReactDOM from 'react-dom';
import ReactModal from 'react-modal';
import { Provider } from 'react-redux';
import { Redirect, Route, Switch } from 'react-router';
import 'sanitize.css';

import { DEFAULT_BASE_PATH, ERC20_APP_BASE_PATH, /*ERC721_APP_BASE_PATH,*/ LOGGER_ID } from './common/constants';
import { AppContainer } from './components/app';
import { Erc20App } from './components/erc20/erc20_app';
//import { Erc721App } from './components/erc721/erc721_app';
import './index.css';
import * as serviceWorker from './serviceWorker';
import { history, store } from './store';
import ReactGA from 'react-ga';

// Adding analytics
ReactGA.initialize(process.env.REACT_APP_ANALYTICS || '');

history.listen(his =>{
    ReactGA.pageview(his.pathname +  his.search);
})



ReactModal.setAppElement('#root');



if (['development', 'production'].includes(process.env.NODE_ENV) && !window.localStorage.debug) {
    // Log only the app constant id to the console
    window.localStorage.debug = `${LOGGER_ID}*`;
}
const RedirectToHome = () => <Redirect to={DEFAULT_BASE_PATH} />;

const Web3WrappedApp = (
    <Provider store={store}>
        <ConnectedRouter history={history}>
            <AppContainer>
                <Switch>
                    <Route path={ERC20_APP_BASE_PATH} component={Erc20App} />
                    { /* <Route path={ERC721_APP_BASE_PATH} component={Erc721App} />*/ }
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
serviceWorker.register();
