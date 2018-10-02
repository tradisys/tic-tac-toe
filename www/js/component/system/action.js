// @flow

import {systemConst} from './const';

export type OnResizeType = {|
    +type: 'system__resize',
    +payload: {|
        +width: number,
        +height: number
    |}
|};

export function onResize(width: number, height: number): OnResizeType {
    return {
        type: systemConst.action.type.resize,
        payload: {
            width,
            height
        }
    };
}

export type OnSetIsScrollEnableType = {|
    +type: 'system__set-is-scroll-enable',
    +payload: {|
        +isEnable: boolean,
        +disableId: string
    |}
|};

export function setIsScrollEnable(isEnable: boolean, disableId: string): OnSetIsScrollEnableType {
    return {
        type: systemConst.action.type.isScrollEnable,
        payload: {
            isEnable,
            disableId
        }
    };
}
