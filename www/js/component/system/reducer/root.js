// @flow

/* global window */

import {combineReducers} from 'redux';
import screen, {type ScreenType} from './screen';
import scroll, {type ScrollType} from './scroll';

export default combineReducers({
    screen,
    scroll
});

export type SystemType = {|
    +screen: ScreenType,
    +scroll: ScrollType
|};
