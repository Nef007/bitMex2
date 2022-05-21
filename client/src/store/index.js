import React, { createContext, useContext } from "react";
import {current_user} from './currentUser'
import {users} from "./users";
import {notification} from "./info";

import {system} from "./system";



export const rootStore = { system,  current_user, users, notification,   };

export const RootStoreContext = createContext({rootStore} );

export const useRootStore = () => useContext(RootStoreContext);

export const RootStoreProvider = ({ store, children }) => {
    return <RootStoreContext.Provider value={store}>{children}</RootStoreContext.Provider>;
};


