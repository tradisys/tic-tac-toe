// @flow

import React, {Component} from 'react';

declare module 'redux-devtools' {
    declare export var createDevTools: (component: Component) => Component;
    // declare export var VKShareButton: Component<void, {url: string}>;
    // declare export var OKShareButton: Component<void, {url: string}>;
    //
    // declare export var FacebookIcon: Component<void, {size: number, round: boolean}>;
    // declare export var VKIcon: Component<void, {size: number, round: boolean}>;
    // declare export var OKIcon: Component<void, {size: number, round: boolean}>;
}

declare module 'redux-devtools-dock-monitor' {
    declare export default Component;
}

declare module 'redux-devtools-log-monitor' {
    declare export default Component;
}
