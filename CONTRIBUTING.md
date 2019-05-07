# Contribution Guide

## Structure

The following short project walk-through may come in handy to understand the code base.

### Main dependencies

The project is a `create-react-app` (CRA) based application, created using its typescript support.

`@0x/connect` supports the interaction with the relayer (`0x-launch-kit`), while `0x.js` and `@0x/web3-wrapper` deal with common web3 sync and erc20 handling tasks.

`redux` is used to handle the application's state, alongside with `typesafe-actions` and `redux-thunk`.

`react-router` has been added to manage routes and history (connected to the store).

Other important dependencies include: `styled-components` and `react-modal`.

### Folder structure

What follows is a description of the `/src` folder, since everything else is pretty standard to a CRA app:

-   `/assets`: keeps SVG files for the ERC20 token icons that can be _imported and used as components_ (that's why they are not in the root's `/public`).
-   `/common`: has the common `constants` file and the ERC20 tokens' metadata + the available markets (base/quote) definitions.
-   `/components`: organized around the two main sections of the app, or things considered to deserve their own directory.
    -   `account`: components from "My Wallet" section.
    -   `marketplace`: components from the main "Marketplace" section (the home page).
    -   `notifications`: in charge or showing online and offline notifications.
    -   `common`: everything else like toolbar components, cards, modals, etc.
-   `/pages`: has the two main components `marketplace` and `my_wallet`, which are referenced in the routes' configuration and combine the most important components from the above folders.
-   `/services`: mostly keeps modules that are frequently used across the application. Some of these are _singletons_-like and/or wrap the usage/instantiation of an external dependency (e.g. `web3-wrapper`).
-   `/store`: organized around the state shape (check `StoreState` in `/src/util/types.ts`). There are two main `actions.ts` and `reducers.ts` files which export the corresponding actions and reducers of the sub-folders and add any general thing on their own. Some action files perform some _business-aid_ logic, so they have thunk actions that do not alter the state of the store.
-   `/util`: utility modules. The idea is to keep the code here as pure as possible, and therefore fully tested. This directory also includes `types.ts`, that contains the interfaces and enums used throughout the application.

### Conventions

#### Components

We have presentational and container components. Container components connect presentational components to the store. For instance, if we have the presentational component `Foo`, the redux-connected component will be named `FooContainer`.

The interfaces that reflect the interaction with the store will be named `StateProps` and `DispatchProps`. If the component has own properties, they will end up in the `OwnProps` interface.

The `State` interface name is reserved for the internal component's state.

Styled components are usually located in the same file of the component that uses them. They are not exported unless they are used somewhere else.

#### Store

In general, reducers tend to be simple and complexity relies on the action's code. We created folders inside `/src/store` that contain the main reducers' files + the more or less related actions file.

In the root `/src/store` folder you can find things that are common: the selectors file and the `action.ts` file that exports the actions from the sub-folders.
