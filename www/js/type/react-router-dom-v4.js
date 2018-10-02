// @flow

// NOTE: Below are duplicated from react-router. If updating these, please
// update the react-router and react-router-native types as well.

export type StaticRouterContextType = {
    url?: string
};

export type LocationType = {
    pathname: string,
    search: string,
    hash: string,
    state?: {},
    key?: string
};

export type LocationShapeType = {
    pathname?: string,
    search?: string,
    hash?: string,
    state?: {}
};

export type HistoryActionType = 'PUSH' | 'REPLACE' | 'POP';

export type RouterHistoryType = {
    length: number,
    location: LocationType,
    action: HistoryActionType,
    listen(callback: (location: LocationType, action: HistoryActionType) => void): () => void,
    push(path: string | LocationShapeType, state?: {}): void,
    replace(path: string | LocationShapeType, state?: {}): void,
    go(n: number): void,
    goBack(): void,
    goForward(): void,
    canGo?: (n: number) => boolean,
    block(callback: (location: LocationType, action: HistoryActionType) => boolean): void,
    // createMemoryHistory
    index?: number,
    entries?: Array<LocationType>
};

export type MatchType = {
    params: {[key: string]: ?string},
    isExact: boolean,
    path: string,
    url: string
};

export type ContextRouterType = {|
    history: RouterHistoryType,
    location: LocationType,
    match: MatchType,
    staticContext?: StaticRouterContextType
|};

declare type ContextRouterVoidType = {
    history: RouterHistoryType | void,
    location: LocationType | void,
    match: MatchType | void,
    staticContext?: StaticRouterContextType | void
};

export type GetUserConfirmationType = (message: string, callback: (confirmed: boolean) => void) => void;

export type MatchPathOptionsType = {
    path?: string,
    exact?: boolean,
    sensitive?: boolean,
    strict?: boolean
};
