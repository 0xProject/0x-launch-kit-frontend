import React from 'react';
import { Route, Switch } from 'react-router';

import { ERC721APP_BASE_PATH } from '../../common/constants';

const EmptyErc721Page = () => <pre>@TODO: ERC721APP</pre>;

export const Erc721App = () => (
    <Switch>
        <Route exact={true} path={`${ERC721APP_BASE_PATH}/`} render={EmptyErc721Page} />
    </Switch>
);
