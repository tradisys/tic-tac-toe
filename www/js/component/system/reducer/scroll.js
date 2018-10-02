// @flow

/* global window */

import {systemConst} from '../const';
import type {ActionDataType} from '../../../app/type';

export type ScrollType = {|
    +isEnable: boolean,
    +disableIdList: Array<string>
|};

const defaultScrollState: ScrollType = {
    isEnable: true,
    disableIdList: []
};

function isScrollEnable(disableIdList: Array<string>): boolean {
    return disableIdList.length === 0;
}

// eslint-disable-next-line complexity
export default (scrollState: ScrollType = defaultScrollState, actionData: ActionDataType): ScrollType => {
    if (actionData.type !== systemConst.action.type.isScrollEnable) {
        return scrollState;
    }

    if (typeof actionData.payload === 'undefined') {
        return scrollState;
    }

    const {isEnable, disableId} = actionData.payload;
    const {disableIdList} = scrollState;

    const disableIndex = disableIdList.indexOf(disableId);

    // enable scroll
    if (isEnable) {
        if (disableIndex === -1) {
            console.error('Can not find disable index', disableId);
            return scrollState;
        }

        disableIdList.splice(disableIndex, 1);

        return {...scrollState, isEnable: isScrollEnable(disableIdList)};
    }

    if (disableIndex !== -1) {
        console.error('disableId already exists:', disableId);
        console.error('push the same into scrollState.disableIdList:', disableId);
    }

    disableIdList.push(disableId);

    return {...scrollState, isEnable: false};
};
